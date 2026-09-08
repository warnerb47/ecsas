import { Workbook } from 'exceljs';
import { ExcelImportService } from './excel-import';

describe('ExcelImportService', () => {
  let service: ExcelImportService;

  beforeEach(() => {
    service = new ExcelImportService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('parses a semicolon csv into application rows', () => {
    const csv = [
      'N°;Nom;Prénom;Date de naissance;NIN;Adresse;Telephone;Numéro courrier',
      '1;Fall;Amidou;25/03/2006;123456789;Yoff dagoudane, Dakar, Senegal;+221 77 777 77 77;REF-IMP-001',
      '2;Ndiaye;Awa;14/08/1998;999111222;Dakar Plateau, Senegal;+221 33 823 45 67;REF-IMP-002',
    ].join('\r\n');

    const rows = service.parseCsv(csv);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      index: 1,
      lastName: 'Fall',
      firstName: 'Amidou',
      birthdate: '2006-03-25',
      nin: '123456789',
      address: 'Yoff dagoudane, Dakar, Senegal',
      phoneNumber: '+221 77 777 77 77',
      mailRef: 'REF-IMP-001',
    });
    expect(rows[1].birthdate).toEqual('1998-08-14');
  });

  it('parses a comma delimited csv and ignores trailing empty lines', () => {
    const csv = [
      'N°,Nom,Prénom,Date de naissance,NIN,Adresse,Telephone,Numéro courrier',
      '1,Diop,Pape,25/03/2002,123456710,Yoff Layenne; Dakar; Senegal,+221 17 177 17 17,REF-2',
      '',
      '',
    ].join('\n');

    const rows = service.parseCsv(csv);

    expect(rows).toHaveLength(1);
    expect(rows[0].lastName).toBe('Diop');
    expect(rows[0].firstName).toBe('Pape');
    expect(rows[0].mailRef).toBe('REF-2');
  });

  it('supports quoted fields containing the delimiter', () => {
    const csv = [
      'Nom;Prénom;Date de naissance;NIN;Adresse;Telephone;Numéro courrier',
      'Sow;Fatoumata;25/03/2001;223456740;"Yoff Apecsy 3, Dakar; Senegal";+221 49 497 49 49;REF-3',
    ].join('\n');

    const rows = service.parseCsv(csv);

    expect(rows).toHaveLength(1);
    expect(rows[0].address).toBe('Yoff Apecsy 3, Dakar; Senegal');
    expect(rows[0].birthdate).toBe('2001-03-25');
  });

  it('skips rows without any usable data', () => {
    const csv = [
      'Nom;Prénom;Date de naissance;NIN;Adresse;Telephone;Numéro courrier',
      ';;;;;;;',
    ].join('\n');

    const rows = service.parseCsv(csv);

    expect(rows).toHaveLength(0);
  });

  it('parses an xlsx buffer into application rows', async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data Export');
    worksheet.addRow([
      'N°',
      'Nom',
      'Prénom',
      'Date de naissance',
      'NIN',
      'Adresse',
      'Telephone',
      'Numéro courrier',
    ]);
    worksheet.addRow([
      1,
      'Fall',
      'Amidou',
      '25/03/2006',
      '123456789',
      'Yoff dagoudane, Dakar, Senegal',
      '+221 77 777 77 77',
      'REF-IMP-001',
    ]);
    worksheet.addRow([
      2,
      'Ndiaye',
      'Awa',
      '14/08/1998',
      '999111222',
      'Dakar Plateau, Senegal',
      '+221 33 823 45 67',
      'REF-IMP-002',
    ]);

    const buffer = await workbook.xlsx.writeBuffer();

    const rows = await service.parseXlsx(
      buffer as unknown as ArrayBuffer,
    );

    expect(rows).toHaveLength(2);
    expect(rows[0].lastName).toBe('Fall');
    expect(rows[0].firstName).toBe('Amidou');
    expect(rows[0].birthdate).toBe('2006-03-25');
    expect(rows[1].birthdate).toBe('1998-08-14');
  });

  it('parses csv using a custom column mapping for non-standard headers', () => {
    const csv = [
      'Libellé;Profil;N°;Téléphone;Email;Ville;ID;Ref',
      'Dupont;Jean;1;+221 77 000 00 00;j.dupont@mail.com;Dakar;111AAA;REF-X-1',
    ].join('\n');

    const rows = service.parseCsv(csv, {
      lastName: 0,
      firstName: 1,
      phoneNumber: 3,
      address: 5,
      nin: 6,
      mailRef: 7,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].lastName).toBe('Dupont');
    expect(rows[0].firstName).toBe('Jean');
    expect(rows[0].nin).toBe('111AAA');
    expect(rows[0].phoneNumber).toBe('+221 77 000 00 00');
    expect(rows[0].address).toBe('Dakar');
    expect(rows[0].mailRef).toBe('REF-X-1');
    expect(rows[0].birthdate).toBeNull();
  });

  it('detects headers and sample values when inspecting a file', () => {
    const csv = [
      'Nom;Prénom;NIN',
      'Fall;Amidou;123456789',
      'Ndiaye;Awa;999111222',
    ].join('\n');

    const structure = service.inspectCsv(csv);

    expect(structure.columns.map((c) => c.name)).toEqual([
      'Nom',
      'Prénom',
      'NIN',
    ]);
    expect(structure.columns[0].sampleValues).toEqual(['Fall', 'Ndiaye']);
    expect(structure.detectedMapping).toEqual({
      lastName: 0,
      firstName: 1,
      nin: 2,
    });
  });
});