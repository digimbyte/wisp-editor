use serde::Serialize;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::path::PathBuf;

#[derive(Serialize)]
pub struct BuildResult { pub ok: bool, pub log: String }

#[tauri::command]
pub fn compile_project(project_dir: String, entry_src: String) -> BuildResult {
    // Resolve paths
    let proj = PathBuf::from(project_dir);
    let out_dir = proj.join("build");
    let _ = std::fs::create_dir_all(&out_dir);
    let out_file = out_dir.join("main.wbc");
    let dbg_file = out_dir.join("dbg.json");

    // Prefer bundled python (see §8) else system python
    #[cfg(target_os = "windows")]
    let candidates = vec![
        proj.join("runtime/python/python.exe"), // bundled
        PathBuf::from("python.exe"),
        PathBuf::from("python"),
    ];
    #[cfg(not(target_os = "windows"))]
    let candidates = vec![
        proj.join("runtime/python/bin/python3"), // bundled
        PathBuf::from("python3"),
        PathBuf::from("python"),
    ];

    let py = candidates.into_iter().find(|p| {
        if p.is_absolute() {
            p.exists()
        } else {
            // Check if it's available in PATH
            Command::new(p).arg("--version").output().is_ok()
        }
    }).unwrap_or_else(|| PathBuf::from("python"));

    // env: add our tools/wbc to PYTHONPATH so `-m wbc.cli` works
    let mut cmd = Command::new(py);
    cmd.current_dir(&proj)
        .env("PYTHONPATH", "tools/wbc")
        .arg("-m").arg("wbc.cli")
        .arg("compile")
        .arg(entry_src)
        .arg("-o").arg(out_file.to_string_lossy().to_string())
        .arg("--map").arg(dbg_file.to_string_lossy().to_string())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = match cmd.spawn() {
        Ok(c) => c,
        Err(e) => return BuildResult { ok: false, log: format!("Spawn error: {e}") },
    };

    let mut log = String::new();
    if let Some(out) = child.stdout.take() {
        let reader = BufReader::new(out);
        for line in reader.lines() { 
            if let Ok(l) = line { 
                log.push_str(&l); 
                log.push('\n'); 
            } 
        }
    }
    if let Some(err) = child.stderr.take() {
        let reader = BufReader::new(err);
        for line in reader.lines() { 
            if let Ok(l) = line { 
                log.push_str(&l); 
                log.push('\n'); 
            } 
        }
    }

    let status = child.wait().ok();
    let ok = status.map(|s| s.success()).unwrap_or(false);
    BuildResult { ok, log }
}
