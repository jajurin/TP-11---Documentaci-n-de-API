--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2026-05-29 08:07:27

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
-- TOC entry 216 (class 1259 OID 16400)
-- Name: province; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.province (
    id integer NOT NULL,
    name character varying NOT NULL,
    full_name character varying NOT NULL,
    latitude character varying NOT NULL,
    longitude character varying NOT NULL,
    display_order integer
);


ALTER TABLE public.province OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: province_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.province ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4780 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.province (id, name, full_name, latitude, longitude, display_order) FROM stdin;
1	Buenos Aires	Provincia de Buenos Aires	-36.6769	-60.5588	1
2	Catamarca	Provincia de Catamarca	-28.4696	-65.7852	2
3	Chaco	Provincia del Chaco	-26.3864	-60.7653	3
4	Chubut	Provincia del Chubut	-43.3002	-65.1023	4
5	Córdoba	Provincia de Córdoba	-31.4201	-64.1888	5
6	Corrientes	Provincia de Corrientes	-27.4692	-58.8306	6
7	Entre Ríos	Provincia de Entre Ríos	-31.7319	-60.5238	7
8	Formosa	Provincia de Formosa	-26.1775	-58.1781	8
9	Jujuy	Provincia de Jujuy	-24.1858	-65.2995	9
10	La Pampa	Provincia de La Pampa	-36.6167	-64.2833	10
11	La Rioja	Provincia de La Rioja	-29.4131	-66.8558	11
12	Mendoza	Provincia de Mendoza	-32.8895	-68.8458	12
13	Misiones	Provincia de Misiones	-27.3671	-55.8961	13
14	Neuquén	Provincia del Neuquén	-38.9516	-68.0591	14
15	Río Negro	Provincia de Río Negro	-40.8135	-63.0000	15
16	Salta	Provincia de Salta	-24.7829	-65.4232	16
17	San Juan	Provincia de San Juan	-31.5375	-68.5364	17
18	San Luis	Provincia de San Luis	-33.2950	-66.3356	18
19	Santa Cruz	Provincia de Santa Cruz	-51.6230	-69.2168	19
20	Santa Fe	Provincia de Santa Fe	-31.6333	-60.7000	20
\.

--INSERT INTO public.province (name, full_name, latitude, longitude, display_order) VALUES
('Buenos Aires', 'Provincia de Buenos Aires', -36.6769, -60.5588, 1),
('Catamarca', 'Provincia de Catamarca', -28.4696, -65.7852, 2),
('Chaco', 'Provincia del Chaco', -26.3864, -60.7653, 3),
('Chubut', 'Provincia del Chubut', -43.3002, -65.1023, 4),
('Córdoba', 'Provincia de Córdoba', -31.4201, -64.1888, 5),
('Corrientes', 'Provincia de Corrientes', -27.4692, -58.8306, 6),
('Entre Ríos', 'Provincia de Entre Ríos', -31.7319, -60.5238, 7),
('Formosa', 'Provincia de Formosa', -26.1775, -58.1781, 8),
('Jujuy', 'Provincia de Jujuy', -24.1858, -65.2995, 9),
('La Pampa', 'Provincia de La Pampa', -36.6167, -64.2833, 10),
('La Rioja', 'Provincia de La Rioja', -29.4131, -66.8558, 11),
('Mendoza', 'Provincia de Mendoza', -32.8895, -68.8458, 12),
('Misiones', 'Provincia de Misiones', -27.3671, -55.8961, 13),
('Neuquén', 'Provincia del Neuquén', -38.9516, -68.0591, 14),
('Río Negro', 'Provincia de Río Negro', -40.8135, -63.0000, 15),
('Salta', 'Provincia de Salta', -24.7829, -65.4232, 16),
('San Juan', 'Provincia de San Juan', -31.5375, -68.5364, 17),
('San Luis', 'Provincia de San Luis', -33.2950, -66.3356, 18),
('Santa Cruz', 'Provincia de Santa Cruz', -51.6230, -69.2168, 19),
('Santa Fe', 'Provincia de Santa Fe', -31.6333, -60.7000, 20);

-- TOC entry 4786 (class 0 OID 0)
-- Dependencies: 215
-- Name: province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.province_id_seq', 20, true);


--
-- TOC entry 4635 (class 2606 OID 16406)
-- Name: province province_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pk PRIMARY KEY (id);


-- Completed on 2026-05-29 08:07:27

--
-- PostgreSQL database dump complete
--

