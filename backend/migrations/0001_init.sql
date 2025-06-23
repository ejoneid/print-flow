PRAGMA journal_mode = WAL;

PRAGMA syncronous = NORMAL;

PRAGMA busy_timeout = 5000;

PRAGMA cache_size = 50000;

PRAGMA temp_store = memory;

create table print_queue (
    uuid text primary key,
    name varchar(128) not null,
    url text,
    status varchar(128) not null,
    status_updated_at datetime not null default (datetime ('now')),
    status_updated_by text not null,
    created_at datetime not null default (datetime ('now')),
    created_by text not null
);
