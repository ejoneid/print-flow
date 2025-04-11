create table material (
    uuid text not null primary key,
    print_queue_uuid text not null references print_queue(uuid),
    type varchar(255) not null,
    color varchar(255) not null
);

alter table print_queue add column completed_at datetime;