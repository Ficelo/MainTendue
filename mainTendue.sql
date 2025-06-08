--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-08 16:21:32 CEST

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16557)
-- Name: condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condition (
    username character varying(50) NOT NULL,
    condition character varying(100) NOT NULL
);


ALTER TABLE public.condition OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16531)
-- Name: friend; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friend (
    username_init character varying(50) NOT NULL,
    username_friend character varying(50) NOT NULL,
    active boolean DEFAULT false NOT NULL
);


ALTER TABLE public.friend OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16547)
-- Name: interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interest (
    username character varying(50) NOT NULL,
    interest character varying(100) NOT NULL
);


ALTER TABLE public.interest OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16512)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_username character varying(50) NOT NULL,
    receiver_username character varying(50) NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16511)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 219
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 218 (class 1259 OID 16501)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16500)
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
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3468 (class 2604 OID 16515)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 3467 (class 2604 OID 16504)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3484 (class 2606 OID 16561)
-- Name: condition condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY (username, condition);


--
-- TOC entry 3480 (class 2606 OID 16536)
-- Name: friend friend_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT friend_pkey PRIMARY KEY (username_init, username_friend);


--
-- TOC entry 3482 (class 2606 OID 16551)
-- Name: interest interest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest
    ADD CONSTRAINT interest_pkey PRIMARY KEY (username, interest);


--
-- TOC entry 3478 (class 2606 OID 16520)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3472 (class 2606 OID 16510)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3474 (class 2606 OID 16506)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3476 (class 2606 OID 16508)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3490 (class 2606 OID 16562)
-- Name: condition condition_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- TOC entry 3485 (class 2606 OID 16526)
-- Name: messages fk_receiver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_receiver FOREIGN KEY (receiver_username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- TOC entry 3486 (class 2606 OID 16521)
-- Name: messages fk_sender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_sender FOREIGN KEY (sender_username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- TOC entry 3487 (class 2606 OID 16542)
-- Name: friend friend_username_friend_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT friend_username_friend_fkey FOREIGN KEY (username_friend) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- TOC entry 3488 (class 2606 OID 16537)
-- Name: friend friend_username_init_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT friend_username_init_fkey FOREIGN KEY (username_init) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- TOC entry 3489 (class 2606 OID 16552)
-- Name: interest interest_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest
    ADD CONSTRAINT interest_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON DELETE CASCADE;


-- Completed on 2025-06-08 16:21:32 CEST

--
-- PostgreSQL database dump complete
--

