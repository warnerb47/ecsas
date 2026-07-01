import Database from '@tauri-apps/plugin-sql';

export async function openConnection() {
  const db = await Database.load('sqlite:ecsas.db');
  return db;
}

export async function closeConnection(db: Database) {
  await db.close();
}

export function parseKey(params: {
  entity: Record<string, unknown>;
  key: string;
}) {
  const { entity, key } = params;
  if (key in entity) {
    const pasedValue = JSON.parse(entity[key] as unknown as string);
    const parsedResult = { [key]: pasedValue };
    return parsedResult;
  }
  return {};
}
