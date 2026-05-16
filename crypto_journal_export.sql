--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: trade_journals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trade_journals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    trade_date date NOT NULL,
    remarks text,
    screenshots json,
    mood character varying(255),
    pnl numeric(15,2),
    trades_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    cex_account_id bigint
);


--
-- Name: trade_journals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trade_journals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trade_journals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trade_journals_id_seq OWNED BY public.trade_journals.id;


--
-- Name: trades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trades (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    cex_account_id bigint NOT NULL,
    trade_date timestamp(0) without time zone NOT NULL,
    pairs character varying(255) NOT NULL,
    direction character varying(255),
    leverage numeric(8,2),
    position_size numeric(20,8),
    entry_price numeric(20,8),
    exit_price numeric(20,8),
    status character varying(255) DEFAULT 'OPEN'::character varying NOT NULL,
    pnl_amount numeric(20,8),
    pnl_percentage numeric(10,4),
    session character varying(255),
    market_cap character varying(255),
    primary_setup_type character varying(255),
    key_indicators character varying(255),
    timeframe_analysis character varying(255),
    risk_percentage numeric(5,2),
    mid_trade_changes integer DEFAULT 0 NOT NULL,
    entry_window integer,
    pre_trade_confidence integer,
    emotional_load integer,
    photo_url character varying(255),
    remarks text,
    is_manual boolean DEFAULT false NOT NULL,
    synced_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT trades_direction_check CHECK (((direction)::text = ANY ((ARRAY['LONG'::character varying, 'SHORT'::character varying, 'BUY'::character varying, 'SELL'::character varying])::text[]))),
    CONSTRAINT trades_key_indicators_check CHECK (((key_indicators)::text = ANY ((ARRAY['EMA crossover'::character varying, 'RSI divergence'::character varying, 'Volume spike'::character varying, 'Order block'::character varying, 'Liquidity grab'::character varying])::text[]))),
    CONSTRAINT trades_market_cap_check CHECK (((market_cap)::text = ANY ((ARRAY['High-Cap'::character varying, 'Mid-Cap'::character varying, 'Low-Cap'::character varying])::text[]))),
    CONSTRAINT trades_primary_setup_type_check CHECK (((primary_setup_type)::text = ANY ((ARRAY['Breakout'::character varying, 'Pullback'::character varying, 'Reversal'::character varying, 'Trend Continuation'::character varying, 'Range Trade'::character varying, 'News/Event'::character varying])::text[]))),
    CONSTRAINT trades_session_check CHECK (((session)::text = ANY ((ARRAY['Asian Session'::character varying, 'US Session'::character varying, 'London Session'::character varying])::text[]))),
    CONSTRAINT trades_status_check CHECK (((status)::text = ANY ((ARRAY['WIN'::character varying, 'LOSE'::character varying, 'OPEN'::character varying])::text[])))
);


--
-- Name: trades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trades_id_seq OWNED BY public.trades.id;


--
-- Name: user_cex_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_cex_accounts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    cex_name character varying(50) NOT NULL,
    account_label character varying(100),
    api_key text NOT NULL,
    api_secret text NOT NULL,
    api_passphrase text,
    is_active boolean DEFAULT true NOT NULL,
    last_synced_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: user_cex_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_cex_accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_cex_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_cex_accounts_id_seq OWNED BY public.user_cex_accounts.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    trader_type character varying(255),
    gender character varying(255),
    birth_year integer,
    primary_goal character varying(255),
    acquisition_sources json,
    subscription_plan character varying(255) DEFAULT 'free'::character varying NOT NULL,
    broker character varying(255),
    sync_method character varying(255),
    api_key character varying(255),
    api_secret character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    api_passphrase character varying(255),
    CONSTRAINT user_profiles_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying])::text[])))
);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: trade_journals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_journals ALTER COLUMN id SET DEFAULT nextval('public.trade_journals_id_seq'::regclass);


--
-- Name: trades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades ALTER COLUMN id SET DEFAULT nextval('public.trades_id_seq'::regclass);


--
-- Name: user_cex_accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cex_accounts ALTER COLUMN id SET DEFAULT nextval('public.user_cex_accounts_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_04_29_025143_create_user_profiles_table	1
5	2026_04_29_025314_create_personal_access_tokens_table	1
6	2026_04_29_184443_add_api_passphrase_to_user_profiles_table	1
7	2026_04_30_053047_create_trade_journals_table	1
8	2026_04_30_090352_update_trade_journals_remarks_to_mediumtext	1
9	2026_05_01_000000_create_user_cex_accounts_table	1
10	2026_05_01_100000_migrate_existing_cex_accounts	1
11	2026_05_01_120000_add_cex_account_id_to_trade_journals	1
12	2026_05_03_000000_create_trades_table	2
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\User	11	auth_token	d7c09d6082c244951e05d81d8e34488407a88f03b6d5ce614b480594d0a42b3c	["*"]	2026-04-30 06:38:52	\N	2026-04-30 06:06:30	2026-04-30 06:38:52
2	App\\Models\\User	16	auth_token	22af6613bf994cce20df22828ad8a9e7990e1d2828f9157357b7957e81f855d4	["*"]	\N	\N	2026-04-30 08:05:04	2026-04-30 08:05:04
3	App\\Models\\User	17	auth_token	577074952e059d0b2c37c00fdb5faec040409fbcfb89f26c7dea072e5ec3b99c	["*"]	\N	\N	2026-04-30 08:54:41	2026-04-30 08:54:41
4	App\\Models\\User	17	auth_token	9c2df767cb272fa73d5e364a9029d78fae6b426c23b73cec94e8a0bd85981dd8	["*"]	2026-04-30 09:55:21	\N	2026-04-30 08:56:27	2026-04-30 09:55:21
5	App\\Models\\User	11	auth_token	46ff427263c39bf5fdc258a400b3dc0cc1048b97e0ce83f7aa653f7585d347ea	["*"]	\N	\N	2026-04-30 14:44:32	2026-04-30 14:44:32
6	App\\Models\\User	18	auth_token	49671029579a362492380db30f1b65b9000c02b6d9efce0e72f388fa7870c994	["*"]	\N	\N	2026-04-30 14:47:29	2026-04-30 14:47:29
7	App\\Models\\User	19	auth_token	0d621cf9f47610188745c3725c367a7a1f92e9648911f056d21e0467acab4a22	["*"]	2026-04-30 15:22:34	\N	2026-04-30 15:16:07	2026-04-30 15:22:34
8	App\\Models\\User	17	auth_token	97a80ca754389279a2e0e6467676ace283872e5cdee97cdc9f846f6eb6556aad	["*"]	2026-05-01 04:06:18	\N	2026-05-01 02:42:00	2026-05-01 04:06:18
9	App\\Models\\User	20	auth_token	7329bb7a73a5447bf658f8ee05fd46ba9cbbc67f072a6a050e07abe64ba2a6b5	["*"]	2026-05-01 04:12:23	\N	2026-05-01 04:09:53	2026-05-01 04:12:23
10	App\\Models\\User	20	auth_token	9343d6b0019e0539e463092d16a61d80935be49e818becbb41f0760d3e47b5ef	["*"]	2026-05-01 04:27:15	\N	2026-05-01 04:17:32	2026-05-01 04:27:15
13	App\\Models\\User	20	auth_token	f7dcf57c8d3c63be14e120a3841e1db044f7bad77798eb0cee953c2f7f59c679	["*"]	2026-05-07 09:15:13	\N	2026-05-04 15:40:34	2026-05-07 09:15:13
19	App\\Models\\User	21	auth_token	330d6b319c3d7dd90fa677731d1c11b26b342b27e2c6ff3e5f07f41868c0462c	["*"]	2026-05-07 09:21:59	\N	2026-05-07 09:20:45	2026-05-07 09:21:59
15	App\\Models\\User	20	auth_token	6e5dbfe4ebbc4c9f2b9a9e6103dfc2886733b09f883c2f143f5e5d91b0b7b341	["*"]	2026-05-07 04:18:09	\N	2026-05-07 04:10:33	2026-05-07 04:18:09
22	App\\Models\\User	21	auth_token	52b2a76be1326f37d0e9d7ae5f6d4876221402adccdcc783b5cfadea5cba37b8	["*"]	2026-05-07 09:31:15	\N	2026-05-07 09:26:45	2026-05-07 09:31:15
33	App\\Models\\User	21	auth_token	d83c2a4a2eaaf88c641070ced06b1137983604a014fdd43b1b91b4df53060905	["*"]	2026-05-11 14:26:25	\N	2026-05-11 14:24:49	2026-05-11 14:26:25
29	App\\Models\\User	21	auth_token	213b9c4e9be7a968521f19687b30fe67c10ee8bcefca9cfb78b9d074f161b70e	["*"]	2026-05-11 14:10:44	\N	2026-05-10 16:39:52	2026-05-11 14:10:44
11	App\\Models\\User	20	auth_token	98a812823d71bc7588613d81a401c9aa2dbee1c22a424a8d6658aff6a7afdc33	["*"]	2026-05-03 13:57:00	\N	2026-05-01 04:28:17	2026-05-03 13:57:00
14	App\\Models\\User	20	auth_token	f256cc80c07f24dcfedf1d23960ba31c166de06b7823cdb5057be48be48c3996	["*"]	2026-05-07 04:07:56	\N	2026-05-06 18:44:37	2026-05-07 04:07:56
12	App\\Models\\User	20	auth_token	dacb2f38e94f1988df7cf06b9197c2b7942e1ab342fefc0a66b04f7140fb2556	["*"]	2026-05-03 17:27:38	\N	2026-05-03 13:58:27	2026-05-03 17:27:38
28	App\\Models\\User	21	auth_token	4c3c7e6de54cda46f6812442d80c89b37a8fcfeebf26bd2149a56be65a48109e	["*"]	2026-05-10 16:39:07	\N	2026-05-10 15:38:00	2026-05-10 16:39:07
21	App\\Models\\User	21	auth_token	8efe50f1aefe88629dda4779a7ec23af7071ab6913d287d57f1b35c734a61f62	["*"]	2026-05-07 09:26:07	\N	2026-05-07 09:23:48	2026-05-07 09:26:07
25	App\\Models\\User	21	auth_token	ae72a415978ae95ea0e10193a4025243fc1b8b412f64d4829aad9cca686bf8d8	["*"]	2026-05-07 14:00:53	\N	2026-05-07 13:57:52	2026-05-07 14:00:53
16	App\\Models\\User	20	auth_token	bfa701e81738843cb895e9b1747b39d866649da4a7ba242a0b47668395143eb7	["*"]	2026-05-07 04:20:57	\N	2026-05-07 04:18:26	2026-05-07 04:20:57
20	App\\Models\\User	20	auth_token	b757799eeabc219b0291679d0691076450e99489bb3510af4209e88f5eef0ea8	["*"]	2026-05-07 09:26:33	\N	2026-05-07 09:22:37	2026-05-07 09:26:33
23	App\\Models\\User	21	auth_token	813b805e89cc2b8c3622b2c41ba4fa9602a228e3dc7e96b91b444e61899757af	["*"]	2026-05-07 09:36:50	\N	2026-05-07 09:31:28	2026-05-07 09:36:50
32	App\\Models\\User	21	auth_token	bfd56e0ff74288d1796929985d722849a0d529eb77e560a26114adf9d68d91c3	["*"]	\N	\N	2026-05-11 14:24:46	2026-05-11 14:24:46
24	App\\Models\\User	21	auth_token	0b3ae13e2f18830b550e542910159ba72df36cb1889bff8990aafb8ed893e4fc	["*"]	2026-05-07 13:57:50	\N	2026-05-07 09:49:03	2026-05-07 13:57:50
18	App\\Models\\User	21	auth_token	54f10ac525dcf4e1529ee49b70fb655a00969b135ead7e642aa1df8e7e3d85fe	["*"]	2026-05-07 09:15:08	\N	2026-05-07 08:00:04	2026-05-07 09:15:08
17	App\\Models\\User	20	auth_token	37a1fd9363d2220b755a43d9d4d66561c849f94c5cd4c0794c38de0f174b8c6e	["*"]	2026-05-07 07:54:00	\N	2026-05-07 04:21:23	2026-05-07 07:54:00
30	App\\Models\\User	21	auth_token	a423aa68096f30bc252e018f752ec9c0d98949609ee1318310585d07bcc917d3	["*"]	2026-05-11 14:15:08	\N	2026-05-11 14:11:03	2026-05-11 14:15:08
31	App\\Models\\User	21	auth_token	ee274fe796882b564a75338172e5d133f6ade6073f2fb562be61da9d0116260e	["*"]	2026-05-11 14:24:48	\N	2026-05-11 14:15:25	2026-05-11 14:24:48
27	App\\Models\\User	21	auth_token	d4db90fd0fc01b8be00eba5c8afb4c43e3f78668f90b990f8063df3fad3e1ef3	["*"]	2026-05-10 15:37:59	\N	2026-05-07 14:50:58	2026-05-10 15:37:59
26	App\\Models\\User	21	auth_token	5205000dda7a40438f5846bfa2f120fc985b5abb49301250d585a70a00f4f085	["*"]	2026-05-07 14:50:57	\N	2026-05-07 14:44:42	2026-05-07 14:50:57
36	App\\Models\\User	20	auth_token	e15d705066f29de7f6a2c162c12163e6e774a9246f69707c308ce09b2cdc1f3b	["*"]	2026-05-11 14:38:51	\N	2026-05-11 14:35:57	2026-05-11 14:38:51
35	App\\Models\\User	20	auth_token	9908950671651a39409036120f79f6d12c1faa33dab4279960938a8ca6824890	["*"]	2026-05-11 14:35:43	\N	2026-05-11 14:30:43	2026-05-11 14:35:43
34	App\\Models\\User	20	auth_token	0181d1c84f2770efd9158e89d6a898d0e89eda60cf07307e3a4643fc9e5558bc	["*"]	2026-05-11 14:30:40	\N	2026-05-11 14:26:28	2026-05-11 14:30:40
37	App\\Models\\User	21	auth_token	ffd600dc4e3611da3430ce94fa111ffe39d1d46c362cd45c29075a787df0fc86	["*"]	2026-05-16 13:45:01	\N	2026-05-11 15:07:09	2026-05-16 13:45:01
39	App\\Models\\User	21	auth_token	bad12a517b36faa4e702b42511cd7fa45080b2a05e08da25788dd88f375e70ab	["*"]	2026-05-16 14:23:10	\N	2026-05-16 14:21:32	2026-05-16 14:23:10
38	App\\Models\\User	21	auth_token	93dfcd05faa005d47d591813a778ed27bdd0b174e99fad5e5a9104089725d41b	["*"]	2026-05-16 14:21:17	\N	2026-05-16 13:45:01	2026-05-16 14:21:17
40	App\\Models\\User	22	auth_token	bf6c7027e06e89da1ab81e62e5812ff77dc981ea52fa1b12bfdc2099f9b61cc1	["*"]	2026-05-16 15:30:18	\N	2026-05-16 14:26:08	2026-05-16 15:30:18
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: trade_journals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trade_journals (id, user_id, trade_date, remarks, screenshots, mood, pnl, trades_count, created_at, updated_at, cex_account_id) FROM stdin;
9	21	2026-05-11	\N	[]	\N	\N	0	2026-05-11 14:23:02	2026-05-11 14:23:02	20
\.


--
-- Data for Name: trades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trades (id, user_id, cex_account_id, trade_date, pairs, direction, leverage, position_size, entry_price, exit_price, status, pnl_amount, pnl_percentage, session, market_cap, primary_setup_type, key_indicators, timeframe_analysis, risk_percentage, mid_trade_changes, entry_window, pre_trade_confidence, emotional_load, photo_url, remarks, is_manual, synced_at, created_at, updated_at) FROM stdin;
10	21	20	2026-05-07 08:16:49	AVAX / USDT	BUY	\N	2.25300000	0.00000000	\N	WIN	21.75000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
11	21	20	2026-05-07 08:16:49	DOGE / USDT	BUY	\N	238.03350000	0.00000000	\N	WIN	26.57000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
12	21	20	2026-05-07 08:16:49	LINK / USDT	BUY	\N	11.74350000	0.00000000	\N	WIN	118.55000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
13	21	20	2026-05-07 08:16:49	SNX / USDT	BUY	\N	24.72310000	0.00000000	\N	WIN	8.28000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
14	21	20	2026-05-07 08:16:49	TAO / USDT	BUY	\N	0.52940000	0.00000000	\N	WIN	164.24000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
15	21	20	2026-05-07 08:16:49	TKO / USDT	BUY	\N	56.37700000	0.00000000	\N	WIN	3.62000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
16	21	20	2026-05-07 08:16:49	XLM / USDT	BUY	\N	906.32000000	0.00000000	\N	WIN	146.95000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-07 08:16:49
18	21	22	2026-05-07 14:53:40	USDT / USDT	BUY	\N	183.61520000	0.00000000	\N	WIN	183.62000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-07 14:53:40	2026-05-07 14:53:40	2026-05-07 14:53:40
17	21	20	2026-05-07 08:16:49	XRP / USDT	BUY	\N	157.94270000	0.00000000	\N	WIN	224.05000000	\N	London Session	High-Cap	Range Trade	\N	\N	\N	0	\N	7	9	\N	\N	f	2026-05-07 08:16:49	2026-05-07 08:16:49	2026-05-11 14:22:36
19	22	24	2026-05-16 14:27:32	AVAX / USDT	BUY	\N	2.25300000	0.00000000	\N	WIN	20.90000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
20	22	24	2026-05-16 14:27:32	DOGE / USDT	BUY	\N	238.03350000	0.00000000	\N	WIN	25.82000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
21	22	24	2026-05-16 14:27:32	LINK / USDT	BUY	\N	11.74350000	0.00000000	\N	WIN	113.44000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
22	22	24	2026-05-16 14:27:32	SNX / USDT	BUY	\N	24.72310000	0.00000000	\N	WIN	7.66000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
23	22	24	2026-05-16 14:27:32	TAO / USDT	BUY	\N	0.52940000	0.00000000	\N	WIN	143.66000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
24	22	24	2026-05-16 14:27:32	TKO / USDT	BUY	\N	56.37700000	0.00000000	\N	WIN	3.15000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
25	22	24	2026-05-16 14:27:32	XLM / USDT	BUY	\N	906.32000000	0.00000000	\N	WIN	137.20000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
26	22	24	2026-05-16 14:27:32	XRP / USDT	BUY	\N	157.94270000	0.00000000	\N	WIN	222.70000000	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	f	2026-05-16 14:27:32	2026-05-16 14:27:32	2026-05-16 14:27:32
\.


--
-- Data for Name: user_cex_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_cex_accounts (id, user_id, cex_name, account_label, api_key, api_secret, api_passphrase, is_active, last_synced_at, created_at, updated_at) FROM stdin;
20	21	tokocrypto	Main Account	eyJpdiI6ImhDSGRENEdzNllmTm9ZWEN5SDFZRkE9PSIsInZhbHVlIjoiUGZRV0Uwb1ZtTjBNNWdCT2VRdm1kYnk1VzdqUklxS3BjWHVIQTcyZm11RTB0M2dyc1BjTElLa1JjMmNOSDRhOEtPYnBvN1VjdjJCSG9haUJCdnZEYkJ4UDhlM0YwOTRDNDhjeDJKSHlyVDg9IiwibWFjIjoiNzJkMjhhYTFhNzU2Nzc3ZWY5OTQ1MjQzZDFkZDE1MmQ5NTE3NmY3NDA1ZTA5ZDM2ZTA3NTAxNDljOWMxZWZhYiIsInRhZyI6IiJ9	eyJpdiI6IjZzNG54Nnhyc3ljOHJpMHJxODg1dEE9PSIsInZhbHVlIjoiMkplYklPRmpCRFc3SFR6aGcydTdaQjZualRlRFNGTmlmTDlyQ05aVVFxYktEOG5GTEluVm1SUmhTcmVSZFN0QzNpbHZEdUh4b25RQWtwMG5SRWNQc3NzTkpEZU9nays2Y29MQzIwQ0R1UnM9IiwibWFjIjoiYzYwMGM5MWFkNmM3MmFlZmU2MTU5YTg4NmIzYzFmZTBmMzBlNTQwNDAwMjQ3MWQ2YThkZjM0N2FhOGE0NjNmOSIsInRhZyI6IiJ9	\N	t	2026-05-16 14:22:55	2026-05-07 08:10:54	2026-05-16 14:22:55
19	21	indodax	Main Account	eyJpdiI6InJDSlRjdmhIcHZqVjFkV05hMWRDN3c9PSIsInZhbHVlIjoiSDQrcHhVTmtqOHRwZWZINEZxbHFzcmsxVHFINjNteWE5Qm9xTGRtNkhFS3BBazJLNCtOSm1ESzdJNVE4Y2FMQSIsIm1hYyI6IjllNGM2NmIwMGJhY2ZjMDE2YWVlYjhhN2ZmYWFlNWU5NDliYzVjNjZkZGMxZTJlMmIzMTExODdkMjc3NTJkMjUiLCJ0YWciOiIifQ==	eyJpdiI6Ii9rQlRmYWFPNXp2Z0prdEVkb2w3WEE9PSIsInZhbHVlIjoiQVUzRjRoYldRQ2RXdDZVQk9sVXJVWmtwZUVYblpkanRmaTVxMTdDa3ZWYkI1cjJ3QVpna3hGNXJpeUlnOWlFWWVNWTJlR1Z0OTBVdHN5c284TEYxak9rdTJORmgyQ2RabW92MVh4K0pKOGpMNk03QWRpMys3T1RjK09yemxjemUiLCJtYWMiOiIzODk3NjJiODYyNGI2NDFlYjliNGY1MTYyMjc5ZGYyMWFmZjNlMDQwODJmNGIzZjAwYjRkY2Y0ODUxMWFiOTljIiwidGFnIjoiIn0=	\N	t	2026-05-16 14:23:00	2026-05-07 08:00:04	2026-05-16 14:23:00
21	21	mexc	Main Account	eyJpdiI6InZqUUJxL2Z4RWp4WTRieDRPVEpnOFE9PSIsInZhbHVlIjoiamVCYVA3WkR2SE9MbVRUVlVKa0dteFN6T0p4ZXp1OGxiR0J3YU15bEMwaz0iLCJtYWMiOiI5Njg2NDBjMDcwMzIzNmU3ZWY4NzNhODYzZDZjODIzYjY2YWQ2Y2YzODhiMWRmNTZlMzg4NDE0NGNkM2ExNzRhIiwidGFnIjoiIn0=	eyJpdiI6IkQxeEN1MStrMks0REpmWmtwZzdKT2c9PSIsInZhbHVlIjoiSG05Y2ZvdGZHYWxJSnI0NGpCL3Mwd09WaEZPY2RBdzQ5ejQrSno3Z2p3U0t3WjdYbkdjb25udklLb2F6N0o5ayIsIm1hYyI6IjBiNmQ2N2U4Nzc4NTUwNGRmODVjMTQ0Y2IxMTkyNWNkMWY0ZGM3NjlkNTM5MmFhMjM2YmU1NDY4ZjU2ZjEzYzkiLCJ0YWciOiIifQ==	\N	t	2026-05-10 16:55:58	2026-05-07 08:54:57	2026-05-10 16:55:58
23	21	bitget	Main Account	eyJpdiI6InpLQVNxUldMclhGNVFiOEs5R0M1MGc9PSIsInZhbHVlIjoiWkVpL3NjUktzNEVXcG1qWmY4ZVJsS2c1d2Y5eUtNRXREOHJqRXh6SStpMDZST0NtTmRrNzk2SVFsMHRJTC85WSIsIm1hYyI6IjUxZTI1ZDJiYzAzYjQ0ZjBjMTZiYmJmNzMzZGQxOTkxMWQzNjFkMDAzOTZiNGVjMGVkZWZhYWVjNzgzNWIzNDQiLCJ0YWciOiIifQ==	eyJpdiI6ImxJbEQ2ci94Q3B1dXkyN3NkVmJobmc9PSIsInZhbHVlIjoiTDhaamxpTHVscTA2ejBFVzRWZXEzK3dhRGZPUFRRbDJBMjF3QUg5MVUzRnFGb01TSitodG5ieWw1MzE1eDhCcyIsIm1hYyI6IjQxYWY1YTNlYTRkZWViY2ZhYjRmYWE1N2U3NGRlOGFhZjY4NWM0NmU0ZThiMTg4MTcxNzA5MDBhYTRmYjNkYzMiLCJ0YWciOiIifQ==	eyJpdiI6InU1dFo3VVhLWDFEdEQzRDMxSW13bFE9PSIsInZhbHVlIjoiYzJVRnhkcHFWQ2RKc3IzS0RKbVMwUT09IiwibWFjIjoiZWQ1YjFkYmFhNzI3N2M0NGVmNjBmYjZkODE4MTkzNjRmOGY5MzQyMmM0YTRmOWU1MzI5ZjNjZDhhZmFlMThkNSIsInRhZyI6IiJ9	t	\N	2026-05-07 09:08:10	2026-05-07 09:08:10
22	21	binance	Main Account	eyJpdiI6IkFuT0oxRzRVcjhsTGJXTTVsV2VrMmc9PSIsInZhbHVlIjoibW05ZmkydUVaVUlUNU9ZVDFiT2Q2QmlYVVNCNXhxUG4yb3lDeTdDaDdWOHdkbTk0VlFDQ2orRnBTZFE0aEkyM1U3UjR3VGk2NFg4L3ZvZmtneFNOZWJhcmlhZDQ1eFhSNXEyWENpZVlUN2c9IiwibWFjIjoiYWFjYmI5ZDEzNTJjZTFkZmExYzA5MmUzM2FhY2Q5ZDljYWY3ODVmNjc4ZjRkNjg1ZDgxNTMxY2Y4NjJlNzA1ZiIsInRhZyI6IiJ9	eyJpdiI6Ik45azdqNFlVblZ4aC9zYXlIcko5Unc9PSIsInZhbHVlIjoibE9HdHUrcytMaEZhQnAyWGVBOGhHdEFubEo4eXVmY2laRjdtZGcwNmFWYUN0Y3VIYVNadTBabUxiK01JZTl0NGdTSG9VY2NrNFFQS3VQaDM4aVoxdHIvb2IzNGVHMTY2VVRwa3ZyZ0NBakE9IiwibWFjIjoiNWQ3NGIzZGM1M2RjZmEwNmE5ZTVmNDZjNzhhZDBkZWYzYmZiNzUyZDMwNGI5YjEwODFkMTcyMWYxMzFiMTA2MSIsInRhZyI6IiJ9	\N	t	2026-05-11 14:26:19	2026-05-07 08:56:50	2026-05-11 14:26:19
24	22	tokocrypto	Main Account	eyJpdiI6IjhGdGdrTHM0V1I3cG9uWGN4akhnL1E9PSIsInZhbHVlIjoicXdLU1Fkem9uc1EvN3dzbExrRElzR2k4N1NCMkxiRGtST2xzQkJVNUlXdUtnMlA0TGl6U29PdlJHMStaVTZEelp6TmFjSGRpbGpXK2s4MTBLMGdXOU8yaHNuZ1BQVEN1YjNyeFFFWUE5S1U9IiwibWFjIjoiMDAzZGQ3YjBhMDZkMTM5ZDNlMmQ4ZGFiNjJmODYyODc5NGJhMDVmMzIxNjQyMjg3YjU3ZTc3MjExZmRmMGMyOCIsInRhZyI6IiJ9	eyJpdiI6IjcwNUVYdmlGbGc5SFIzaDBGN0I1WXc9PSIsInZhbHVlIjoiMjFUd25waXFnMVVwNmE3WTk2OGVZTFpXUFpBaGdGTzUzSFRFQVpqcVBQTjgrckg0cVc2Vy95Y3lzZE1jNUMvNjRoajR1OEkvQ3VLNEdIRGVMSmxQdVl2NWZ0bnFGVXpkSGJHcTFra2JuUTA9IiwibWFjIjoiMWUwZDI3MDc1NWMwMzIzMGExZTRiMjVhYzY5YmZiNjgyNzQyNTBjODgzZDFjM2IyMzg0NGVmNWRjOWYwZWUzNiIsInRhZyI6IiJ9	\N	t	2026-05-16 14:27:31	2026-05-16 14:26:08	2026-05-16 14:27:31
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profiles (id, user_id, trader_type, gender, birth_year, primary_goal, acquisition_sources, subscription_plan, broker, sync_method, api_key, api_secret, created_at, updated_at, api_passphrase) FROM stdin;
18	21	day	Female	2000	\N	["tiktok"]	pro	indodax	auto	\N	\N	2026-05-07 08:00:04	2026-05-07 08:00:04	\N
19	22	day	Male	2004	\N	["google"]	pro	tokocrypto	auto	\N	\N	2026-05-16 14:26:08	2026-05-16 14:26:08	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
21	user	userdemo@gmail.com	\N	$2y$12$n0wMgFQkP/.m07MJGOphTuhsErxcKpXUvyFPgo4UXF6OcHOpnQHMK	\N	2026-05-07 08:00:03	2026-05-07 08:00:03
22	userdemo	userdemo2@gmail.com	\N	$2y$12$BP4S0ew2uFTvYYzB3/UFqOBhbdTKNScND5UWnvQdPj96UOZOjR4eO	\N	2026-05-16 14:26:08	2026-05-16 14:26:08
\.


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 12, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 40, true);


--
-- Name: trade_journals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trade_journals_id_seq', 9, true);


--
-- Name: trades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trades_id_seq', 26, true);


--
-- Name: user_cex_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_cex_accounts_id_seq', 24, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 19, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: trade_journals journal_unique_per_cex_date; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_journals
    ADD CONSTRAINT journal_unique_per_cex_date UNIQUE (user_id, cex_account_id, trade_date);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: trade_journals trade_journals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_journals
    ADD CONSTRAINT trade_journals_pkey PRIMARY KEY (id);


--
-- Name: trades trades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: user_cex_accounts unique_user_cex_label; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cex_accounts
    ADD CONSTRAINT unique_user_cex_label UNIQUE (user_id, cex_name, account_label);


--
-- Name: user_cex_accounts user_cex_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cex_accounts
    ADD CONSTRAINT user_cex_accounts_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: trade_journals_cex_account_id_trade_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trade_journals_cex_account_id_trade_date_index ON public.trade_journals USING btree (cex_account_id, trade_date);


--
-- Name: trade_journals_user_id_trade_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trade_journals_user_id_trade_date_index ON public.trade_journals USING btree (user_id, trade_date);


--
-- Name: trades_pairs_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trades_pairs_index ON public.trades USING btree (pairs);


--
-- Name: trades_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trades_status_index ON public.trades USING btree (status);


--
-- Name: trades_user_id_cex_account_id_trade_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trades_user_id_cex_account_id_trade_date_index ON public.trades USING btree (user_id, cex_account_id, trade_date);


--
-- Name: user_cex_accounts_user_id_is_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_cex_accounts_user_id_is_active_index ON public.user_cex_accounts USING btree (user_id, is_active);


--
-- Name: trade_journals trade_journals_cex_account_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_journals
    ADD CONSTRAINT trade_journals_cex_account_id_foreign FOREIGN KEY (cex_account_id) REFERENCES public.user_cex_accounts(id) ON DELETE CASCADE;


--
-- Name: trade_journals trade_journals_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trade_journals
    ADD CONSTRAINT trade_journals_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trades trades_cex_account_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_cex_account_id_foreign FOREIGN KEY (cex_account_id) REFERENCES public.user_cex_accounts(id) ON DELETE CASCADE;


--
-- Name: trades trades_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_cex_accounts user_cex_accounts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cex_accounts
    ADD CONSTRAINT user_cex_accounts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

