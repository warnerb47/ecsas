use std::fs;
use std::io::Write;
use std::path::Path;

fn main() {
    create_migrations();
    tauri_build::build()
}


// this method creates a migrations.rs file when building app
fn create_migrations() {
    let migrations_dir = Path::new("migrations");
    let dest_path = Path::new("src/db").join("migrations.rs");
    let mut file = fs::File::create(&dest_path).unwrap();

    // 1. Read all .sql files
    let mut files: Vec<_> = fs::read_dir(migrations_dir)
        .unwrap()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "sql"))
        .collect();

    // 2. Sort by filename to ensure version order (e.g., V1.0.0, V1.0.1...)
    files.sort_by_key(|e| e.path());

    writeln!(file, "use tauri_plugin_sql::{{Migration, MigrationKind}};").unwrap();
    writeln!(file, "pub fn get_migrations() -> Vec<Migration> {{").unwrap();
    writeln!(file, "    vec![").unwrap();

    for (index, entry) in files.iter().enumerate() {
        let path = entry.path();
        let filename = path.file_name().unwrap().to_str().unwrap();
        // Use relative path from src-tauri root
        let relative_path = format!("../../migrations/{}", filename);

        // Version is index + 1 (1-based)
        let version = index + 1;

        writeln!(
            file,
            r#"        Migration {{
            version: {version},
            description: "{filename}",
            sql: include_str!("{relative_path}"),
            kind: MigrationKind::Up,
        }},"#,
            version = version,
            filename = filename,
            relative_path = relative_path
        )
        .unwrap();
    }

    writeln!(file, "    ]").unwrap();
    writeln!(file, "}}").unwrap();

    // Tell Cargo to rerun if migrations folder changes
    println!("cargo:rerun-if-changed=migrations");
}
