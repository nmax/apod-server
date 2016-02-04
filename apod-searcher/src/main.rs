#![feature(plugin)]
#![feature(custom_derive)]

use std::fs;
use std::fs::File;
use std::path::PathBuf;
use std::io;
use std::io::prelude::*;
use std::env;
use std::process;

extern crate serde;
extern crate serde_json;
use serde_json::Value;

extern crate scoped_pool;
use scoped_pool::Pool;

fn list_files (folder_path: &str)  -> Result<Vec<PathBuf>, io::Error> {
    let mut paths = Vec::new();

    for entry in try!(fs::read_dir(folder_path)) {
        let dir = try!(entry);
        match dir.path().extension() {
            Some(v) => if v == "json" { paths.push(dir.path()) },
            None => ()
        }
    }

    Ok(paths)
}

fn read_file_to_apod (path: &PathBuf) -> Result<Value, io::Error> {
    let mut f = try!(File::open(path));
    let mut buffer = String::new();
    let _ = try!(f.read_to_string(&mut buffer));

    let deserialized: Value = serde_json::from_str(&buffer).unwrap();
    Ok(deserialized)
}

fn check_file (path: &PathBuf, needle: &str) {
    let data: Value = read_file_to_apod(&path).unwrap();
    let obj = data.as_object().unwrap();
    let title_obj = obj.get("title");
    let explanation_obj = obj.get("explanation");

    match (title_obj, explanation_obj) {
        (Some(title), Some(explanation)) => {
            let title = title.as_string().unwrap().to_lowercase();
            let explanation = explanation.as_string().unwrap().to_lowercase();
            let title_matches = title.matches(needle);
            let explanation_matches = explanation.matches(needle);
            let search_hits = title_matches.zip(explanation_matches).count();
            if search_hits > 0 {
                println!("{}", path.to_str().unwrap());
            }
        },
        _ => ()
    }
}

fn main() {
    let needle = match env::args().nth(1) {
        Some(first_arg) => String::from(first_arg),
        None => {
            let _ = io::stderr().write(b"please specify a seach term\n");
            process::exit(1)
        }
    };

    let folder_path = match env::args().nth(2) {
        Some(second_arg) => String::from(second_arg),
        None => {
            let _ = io::stderr().write(b"please specify a relative search path\n");
            process::exit(1)
        }
    };

    let pool = Pool::new(4);
    let path_list: Vec<PathBuf> = list_files(&folder_path).expect("a vec of paths bufs");

    pool.scoped(|scope| {
        for path in path_list {
            let n = needle.clone();
            scope.execute(move || {
                check_file(&path, &n);
            });
        }
    });

}
