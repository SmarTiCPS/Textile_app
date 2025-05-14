SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data (Community Edition)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: iotsensordata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iotsensordata (
    id integer NOT NULL,
    iddevice integer,
    data text,
    date timestamp with time zone NOT NULL,
      idtypeevent text
);


ALTER TABLE public.iotsensordata OWNER TO postgres;

--
-- Name: _hyper_2_1_chunk; Type: TABLE; Schema: _timescaledb_internal; Owner: postgres
--

CREATE TABLE _timescaledb_internal._hyper_2_1_chunk (
    CONSTRAINT constraint_1 CHECK (((date >= '2025-02-20 00:00:00+00'::timestamp with time zone) AND (date < '2025-02-27 00:00:00+00'::timestamp with time zone)))
)
INHERITS (public.iotsensordata);


ALTER TABLE _timescaledb_internal._hyper_2_1_chunk OWNER TO postgres;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    devicetype character varying(255),
    localisation text,
    idfactory integer,
    manufacturer character varying(255),
    model_number character varying(255),
    serial_number character varying(255),
    installation_date date,
    status character varying(50),
    deviceid character varying(255)
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
     START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_id_seq OWNER TO postgres;

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- Name: eventtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventtype (
    idtypeevent character(2) NOT NULL,
    typeevent character(50) NOT NULL
);


ALTER TABLE public.eventtype OWNER TO postgres;

--
-- Name: factory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factory (
    id integer NOT NULL,
    factory_name character varying(100) NOT NULL,
    factory_address character varying(100) NOT NULL,
    factory_email character varying(100),
    factory_tel character varying(20),
    idchef integer
);
ALTER TABLE public.factory OWNER TO postgres;

--
-- Name: factory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factory_id_seq OWNER TO postgres;

--
-- Name: factory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factory_id_seq OWNED BY public.factory.id;


--
-- Name: iotsensordata_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
"tables": [
    "eventtype",
    "factory",
    "devices",
    "iotsensordata",
    "typeevent"
  ]

CREATE SEQUENCE public.iotsensordata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.iotsensordata_id_seq OWNER TO postgres;

--
-- Name: iotsensordata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.iotsensordata_id_seq OWNED BY public.iotsensordata.id;
--
-- Name: typeevent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeevent (
    idtypeevent integer NOT NULL,
    typeevent character varying(255) NOT NULL
);


ALTER TABLE public.typeevent OWNER TO postgres;

--
-- Name: typeevent_idtypeevent_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.typeevent_idtypeevent_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.typeevent_idtypeevent_seq OWNER TO postgres;

--
-- Name: typeevent_idtypeevent_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.typeevent_idtypeevent_seq OWNED BY public.typeevent.idtypeevent;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(100),
    secondname character varying(100),
    email character varying(100),
    password text NOT NULL,
    telnumber character varying(20)
);
ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: _hyper_2_1_chunk id; Type: DEFAULT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_2_1_chunk ALTER COLUMN id SET DEFAULT nextval('public.iotsensordata_id_seq'::regclass);


--
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- Name: factory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factory ALTER COLUMN id SET DEFAULT nextval('public.factory_id_seq'::regclass);
--
-- Name: iotsensordata id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iotsensordata ALTER COLUMN id SET DEFAULT nextval('public.iotsensordata_id_seq'::regclass);


--
-- Name: typeevent idtypeevent; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.typeevent ALTER COLUMN idtypeevent SET DEFAULT nextval('public.typeevent_idtypeevent_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: hypertable; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.hypertable (id, schema_name, table_name, associated_schema_name, associated_table_prefix, num_dimensions, chunk_sizing_func_schema, chunk_sizing_func_name, chunk_target_size, compressi>2       public  iotsensordata   _timescaledb_internal   _hyper_2        1       _timescaledb_functions  calculate_chunk_interval        0       0       \N      0
\.


--
-- Data for Name: chunk; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.chunk (id, hypertable_id, schema_name, table_name, compressed_chunk_id, dropped, status, osm_chunk, creation_time) FROM stdin;
1       2       _timescaledb_internal   _hyper_2_1_chunk        \N      f       0       f       2025-02-19 22:52:59.548099+00
\.


--
-- Data for Name: chunk_column_stats; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.chunk_column_stats (id, hypertable_id, chunk_id, column_name, range_start, range_end, valid) FROM stdin;
