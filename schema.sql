CREATE TABLE public."domain" (
  id serial4 NOT NULL,
  name varchar(64) NOT NULL,
  "size" int4 not NULL,
  CONSTRAINT domain_pkey PRIMARY KEY (id)
);
CREATE TABLE public."card" (
  id serial4 NOT NULL,
  domain_id int4 NOT NULL,
  "index" int4 not NULL,
  "text" varchar(64) not null,
  "image" varchar(200) not null,
  CONSTRAINT card_pkey PRIMARY KEY (id)
);
ALTER TABLE
  public.card
ADD
  CONSTRAINT card_fk FOREIGN KEY (domain_id) REFERENCES public."domain"(id);