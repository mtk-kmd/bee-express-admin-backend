-- CREATE Schemas

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION khitkabar;

CREATE SCHEMA IF NOT EXISTS sch_product_management
    AUTHORIZATION khitkabar;

CREATE SCHEMA IF NOT EXISTS sch_purchase_management
    AUTHORIZATION khitkabar;

CREATE SCHEMA IF NOT EXISTS sch_user_management
    AUTHORIZATION khitkabar;

CREATE SCHEMA IF NOT EXISTS sch_voucher_management
    AUTHORIZATION khitkabar;

CREATE SCHEMA IF NOT EXISTS sch_production_management
    AUTHORIZATION khitkabar;

---

CREATE TABLE IF NOT EXISTS

sch_product_management.product_tbl (
    product_id text COLLATE pg_catalog."default" NOT NULL,
    product_name text COLLATE pg_catalog."default",
    packaging_type_id text COLLATE pg_catalog."default",
    is_weight boolean,
    CONSTRAINT product_tbl_pkey PRIMARY KEY (product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."product_tbl"
    OWNER to khitkabar;

---

---

CREATE TABLE IF NOT EXISTS

sch_product_management.product_history_tbl (
    p_history_id text COLLATE pg_catalog."default" NOT NULL,
    product_id text COLLATE pg_catalog."default",
    quantity double precision,
    buy_price double precision,
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT product_history_tbl_pkey PRIMARY KEY (p_history_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."product_history_tbl"
    OWNER to khitkabar;
---

---
CREATE TABLE IF NOT EXISTS

sch_product_management.packaging_type_tbl (
    packaging_type_id text COLLATE pg_catalog."default" NOT NULL,
    packaging_type_name text COLLATE pg_catalog."default",
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT packaging_type_tbl_pkey PRIMARY KEY (packaging_type_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."packaging_type_tbl"
    OWNER to khitkabar;
---

---
CREATE TABLE IF NOT EXISTS

sch_product_management.recipe_group (
    recipe_group_id text COLLATE pg_catalog."default" NOT NULL,
    recipe_group_name text COLLATE pg_catalog."default",
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    original_price double precision,
    sell_price double precision,
    CONSTRAINT recipe_group_tbl_pkey PRIMARY KEY (recipe_group_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."recipe_group"
    OWNER to khitkabar;
---

---
CREATE TABLE IF NOT EXISTS

sch_product_management.recipe_item (
    recipe_item_id text COLLATE pg_catalog."default" NOT NULL,
    product_id text COLLATE pg_catalog."default",
    recipe_group_id text COLLATE pg_catalog."default",
    status boolean,
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT recipe_item_tbl_pkey PRIMARY KEY (recipe_item_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."recipe_item"
    OWNER to khitkabar;
---

CREATE TABLE IF NOT EXISTS

sch_product_management.category_tbl (
    category_id text COLLATE pg_catalog."default" NOT NULL,
    category_name text COLLATE pg_catalog."default",
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT category_tbl_pkey PRIMARY KEY (category_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."category_tbl"
    OWNER to khitkabar;
---

---
CREATE TABLE IF NOT EXISTS

sch_purchase_management.purchase_tbl (
    purchase_id text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    balance_type_id text COLLATE pg_catalog."default",
    CONSTRAINT purchase_tbl_pkey PRIMARY KEY (purchase_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_purchase_management."purchase_tbl"
    OWNER to khitkabar;
---
---
CREATE TABLE IF NOT EXISTS

sch_purchase_management.purchase_product_tbl (
    purchase_product_id text COLLATE pg_catalog."default" NOT NULL,
    purchase_id text COLLATE pg_catalog."default",
    quantity double precision,
    unit_price double precision,
    total_amount double precision,
    product_id text COLLATE pg_catalog."default",
    packaging_type_id text COLLATE pg_catalog."default",
    buy_price double precision,
    sell_price double precision,
    category_id text COLLATE pg_catalog."default",
    is_weight boolean,
    weight double precision,
    total_weight double precision,
    category_id text COLLATE pg_catalog."default",
    CONSTRAINT purchase_product_tbl_pkey PRIMARY KEY (purchase_product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_purchase_management."purchase_product_tbl"
    OWNER to khitkabar;
---

/*stocklist history*/
CREATE TABLE IF NOT EXISTS

sch_product_management.stocklist_history_tbl (
    stocklist_history_id text COLLATE pg_catalog."default" NOT NULL,
    product_id text COLLATE pg_catalog."default",
    purchase_id text COLLATE pg_catalog."default",
    quantity double precision,
    unit_price double precision,
    total_amount double precision,
    product_id text COLLATE pg_catalog."default",
    packaging_type_id text COLLATE pg_catalog."default",
    is_weight boolean,
    weight double precision,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT purchase_product_tbl_pkey PRIMARY KEY (stocklist_history_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_product_management."stocklist_history_tbl"
    OWNER to khitkabar;
---
CREATE TABLE IF NOT EXISTS

sch_purchase_management.balance_type_tbl (
    balance_type_id text COLLATE pg_catalog."default" NOT NULL,
    balance_type_name text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT balance_type_tbl_pkey PRIMARY KEY (balance_type_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_purchase_management."balance_type_tbl"
    OWNER to khitkabar;
---

---
CREATE TABLE IF NOT EXISTS

sch_purchase_management.bill_type_tbl (
    bill_type_id text COLLATE pg_catalog."default" NOT NULL,
    bill_type_name text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT bill_type_tbl_pkey PRIMARY KEY (bill_type_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_purchase_management."bill_type_tbl"
    OWNER to khitkabar;
---

/*purchase history table*/
CREATE TABLE IF NOT EXISTS

sch_purchase_management.purchase_history_tbl (
    purchase_history_id text COLLATE pg_catalog."default" NOT NULL,
    product_id text COLLATE pg_catalog."default",
    purchase_id text COLLATE pg_catalog."default",
    purchase_product_id text COLLATE pg_catalog."defaulၑt",
    quantity double precision,
    packaging_type_id text COLLATE pg_catalog."default",
    total_weight double precision,
    buy_price double precision,
    sell_price double precision,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT purchase_history_tbl_pkey PRIMARY KEY (purchase_history_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_purchase_management."purchase_history_tbl"
    OWNER to khitkabar;
---




---
CREATE TABLE IF NOT EXISTS

sch_user_management.user_tbl (
    user_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    user_password text COLLATE pg_catalog."default",
    status boolean,
    role integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT user_tbl_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_user_management."user_tbl"
    OWNER to khitkabar;
---

---
CREATE SEQUENCE IF NOT EXISTS purchase_voucher_id_seq START 1000;

CREATE TABLE IF NOT EXISTS

sch_voucher_management.purchase_voucher_tbl (
    purchase_voucher_id text DEFAULT CONCAT(nextval('purchase_voucher_id_seq'), '-PC') NOT NULL,
    purchase_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT purchase_voucher_tbl_pkey PRIMARY KEY (purchase_voucher_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_user_management."user_tbl"
    OWNER to khitkabar;
---
---
CREATE TABLE IF NOT EXISTS

sch_production_management.production_tbl (
    production_id text COLLATE pg_catalog."default" NOT NULL,
    recipe_group_id text COLLATE pg_catalog."default",
    recipe_item_id text COLLATE pg_catalog."default",
    actual_weight double precision,
    actual_quantity double precision,
    is_weight boolean,
    user_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT production_tbl_pkey PRIMARY KEY (production_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_user_management."production_tbl"
    OWNER to khitkabar;
---
---
CREATE TABLE IF NOT EXISTS

sch_production_management.production_history_tbl (
    production_history_id text COLLATE pg_catalog."default" NOT NULL,
    recipe_group_id text COLLATE pg_catalog."default",
    recipe_item_id text COLLATE pg_catalog."default",
    production_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    unit_qty double precision,
    total_qty double precision,
    CONSTRAINT production_history_tbl_pkey PRIMARY KEY (production_history_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_user_management."production_history_tbl"
    OWNER to khitkabar;
---