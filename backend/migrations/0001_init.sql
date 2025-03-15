create table print_queue (
    id integer primary key autoincrement,
    name varchar(128) not null,
    url text,
    created_at datetime not null default (datetime('now'))
);