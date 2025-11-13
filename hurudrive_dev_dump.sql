--
-- PostgreSQL database dump
--

\restrict k1Q3omlkOBNk3fa5us4tUK96WUKQIVmukkNedmgcKdgkZJhHi1nwU0NcbHbFUMY

-- Dumped from database version 14.19 (Debian 14.19-1.pgdg13+1)
-- Dumped by pg_dump version 14.19 (Debian 14.19-1.pgdg13+1)

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

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."BookingStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: VehicleStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleStatus" AS ENUM (
    'AVAILABLE',
    'MAINTENANCE',
    'UNAVAILABLE'
);


ALTER TYPE public."VehicleStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "vehicleId" text NOT NULL,
    "pickupLocation" text NOT NULL,
    "returnLocation" text NOT NULL,
    "pickupAt" timestamp(3) without time zone NOT NULL,
    "returnAt" timestamp(3) without time zone NOT NULL,
    "totalPrice" integer NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "bookingId" text,
    "userId" text NOT NULL,
    provider text NOT NULL,
    "providerPaymentId" text,
    amount integer NOT NULL,
    currency text DEFAULT 'KES'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "rawResponse" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    phone text,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    title text NOT NULL,
    make text,
    model text,
    year integer,
    category text,
    seats integer NOT NULL,
    transmission text NOT NULL,
    "fuelType" text NOT NULL,
    location text NOT NULL,
    "dailyPrice" integer NOT NULL,
    status public."VehicleStatus" DEFAULT 'AVAILABLE'::public."VehicleStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: VehicleImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VehicleImage" (
    id text NOT NULL,
    "vehicleId" text NOT NULL,
    url text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."VehicleImage" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "userId", "vehicleId", "pickupLocation", "returnLocation", "pickupAt", "returnAt", "totalPrice", status, "paymentStatus", "createdAt", "updatedAt") FROM stdin;
ac5d9933-67e4-4470-bc81-e0ee7581d9bb	9def6e6f-1409-4b7f-a441-41a77810ecdf	5e8ba401-5614-482a-b93d-8088d3f3c398	Nairobi CBD	Nairobi CBD	2025-11-07 06:32:01.111	2025-11-08 06:32:01.111	3000	PENDING	PENDING	2025-11-07 06:32:01.114	2025-11-07 06:32:01.114
ac788758-49bc-4a35-a284-2a11a8b4190d	9def6e6f-1409-4b7f-a441-41a77810ecdf	0d824cc5-855f-469e-94f2-1ecf36886a9a	Nairobi CBD	Nairobi CBD	2025-11-07 07:00:38.797	2025-11-08 07:00:38.797	3000	PENDING	PENDING	2025-11-07 07:00:38.8	2025-11-07 07:00:38.8
0d0b2111-bc4d-4330-a05e-0df428369a94	9def6e6f-1409-4b7f-a441-41a77810ecdf	c3c34ff8-2fe7-4989-9417-67e6aa4cc441	Nairobi CBD	Nairobi CBD	2025-11-07 07:05:46.572	2025-11-08 07:05:46.572	3000	PENDING	PENDING	2025-11-07 07:05:46.575	2025-11-07 07:05:46.575
d3bd9eee-5195-4e2d-ac60-016f02dc91bf	9def6e6f-1409-4b7f-a441-41a77810ecdf	fe1d7112-9125-45d5-9ea3-6205448d941f	Nairobi CBD	Nairobi CBD	2025-11-07 09:31:51.906	2025-11-08 09:31:51.906	3000	PENDING	PENDING	2025-11-07 09:31:51.909	2025-11-07 09:31:51.909
66816955-4e2e-4c44-8047-87e00797412b	9def6e6f-1409-4b7f-a441-41a77810ecdf	63513577-f2a3-43c3-9f01-3222e00dac36	Nairobi CBD	Nairobi CBD	2025-11-07 10:04:37.647	2025-11-08 10:04:37.647	3000	PENDING	PENDING	2025-11-07 10:04:37.65	2025-11-07 10:04:37.65
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "bookingId", "userId", provider, "providerPaymentId", amount, currency, status, "rawResponse", "createdAt") FROM stdin;
e4d96dd5-7fa1-4cff-949f-10d71badd3b9	\N	9def6e6f-1409-4b7f-a441-41a77810ecdf	stripe	\N	3000	KES	PENDING	\N	2025-11-07 06:32:01.134
9c452f76-b016-4ad2-b72f-208b5cd481f0	\N	9def6e6f-1409-4b7f-a441-41a77810ecdf	stripe	\N	3000	KES	PENDING	\N	2025-11-07 07:00:38.808
0abc4d3a-121a-4342-a631-1781afdb879b	\N	9def6e6f-1409-4b7f-a441-41a77810ecdf	stripe	\N	3000	KES	PENDING	\N	2025-11-07 07:05:46.59
eb47f6d6-f82b-4ad3-8385-80f28787004d	\N	9def6e6f-1409-4b7f-a441-41a77810ecdf	stripe	\N	3000	KES	PENDING	\N	2025-11-07 09:31:51.917
39690fe3-da01-4ed0-81a2-4fa8d8eea67d	\N	9def6e6f-1409-4b7f-a441-41a77810ecdf	stripe	\N	3000	KES	PENDING	\N	2025-11-07 10:04:37.667
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, phone, "passwordHash", role, "createdAt", "updatedAt") FROM stdin;
9def6e6f-1409-4b7f-a441-41a77810ecdf	Admin	admin@example.com	0700000000	changeme	ADMIN	2025-11-07 06:32:01.038	2025-11-07 10:04:37.56
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, title, make, model, year, category, seats, transmission, "fuelType", location, "dailyPrice", status, "createdAt", "updatedAt") FROM stdin;
5e8ba401-5614-482a-b93d-8088d3f3c398	Toyota Prius - Sample A	Toyota	Prius	2018	Sedan	5	Automatic	Hybrid	Nairobi	3000	AVAILABLE	2025-11-07 06:32:01.067	2025-11-07 06:32:01.067
35bc44b2-b528-43ef-b402-b0c9e6a60b70	Nissan Note - Sample B	Nissan	Note	2019	Hatchback	5	Manual	Petrol	Nakuru	2000	AVAILABLE	2025-11-07 06:32:01.101	2025-11-07 06:32:01.101
0d824cc5-855f-469e-94f2-1ecf36886a9a	Toyota Prius - Sample A	Toyota	Prius	2018	Sedan	5	Automatic	Hybrid	Nairobi	3000	AVAILABLE	2025-11-07 07:00:38.755	2025-11-07 07:00:38.755
4a4ee656-0740-4203-98f1-7147eea6493d	Nissan Note - Sample B	Nissan	Note	2019	Hatchback	5	Manual	Petrol	Nakuru	2000	AVAILABLE	2025-11-07 07:00:38.782	2025-11-07 07:00:38.782
c3c34ff8-2fe7-4989-9417-67e6aa4cc441	Toyota Prius - Sample A	Toyota	Prius	2018	Sedan	5	Automatic	Hybrid	Nairobi	3000	AVAILABLE	2025-11-07 07:05:46.525	2025-11-07 07:05:46.525
dad934df-a23a-4bc0-b30e-fb27621dfb08	Nissan Note - Sample B	Nissan	Note	2019	Hatchback	5	Manual	Petrol	Nakuru	2000	AVAILABLE	2025-11-07 07:05:46.541	2025-11-07 07:05:46.541
fe1d7112-9125-45d5-9ea3-6205448d941f	Toyota Prius - Sample A	Toyota	Prius	2018	Sedan	5	Automatic	Hybrid	Nairobi	3000	AVAILABLE	2025-11-07 09:31:51.889	2025-11-07 09:31:51.889
00139d8c-15e4-4bf0-9487-75de4549fac1	Nissan Note - Sample B	Nissan	Note	2019	Hatchback	5	Manual	Petrol	Nakuru	2000	AVAILABLE	2025-11-07 09:31:51.9	2025-11-07 09:31:51.9
63513577-f2a3-43c3-9f01-3222e00dac36	Toyota Prius - Sample A	Toyota	Prius	2018	Sedan	5	Automatic	Hybrid	Nairobi	3000	AVAILABLE	2025-11-07 10:04:37.593	2025-11-07 10:04:37.593
99e2b891-49bb-4476-bc47-90ad7bdd8060	Nissan Note - Sample B	Nissan	Note	2019	Hatchback	5	Manual	Petrol	Nakuru	2000	AVAILABLE	2025-11-07 10:04:37.618	2025-11-07 10:04:37.618
\.


--
-- Data for Name: VehicleImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VehicleImage" (id, "vehicleId", url, "order") FROM stdin;
6070bd2d-ad29-4749-9c3d-19e9f7f96c63	5e8ba401-5614-482a-b93d-8088d3f3c398	https://placehold.co/600x400?text=Prius+1	0
dd90fbc7-a7f9-4ff1-9c98-556fe5f569d2	5e8ba401-5614-482a-b93d-8088d3f3c398	https://placehold.co/600x400?text=Prius+2	1
85bf5615-e275-446a-a819-9a26edb6d9e0	35bc44b2-b528-43ef-b402-b0c9e6a60b70	https://placehold.co/600x400?text=Note+1	0
f969d650-2fea-469a-ad68-f89aefeacc81	0d824cc5-855f-469e-94f2-1ecf36886a9a	https://placehold.co/600x400?text=Prius+1	0
69be958e-0d4a-4ae0-b67b-dcf7ae89950d	0d824cc5-855f-469e-94f2-1ecf36886a9a	https://placehold.co/600x400?text=Prius+2	1
ca6b91e2-b558-48d6-8272-9b3afa9ec806	4a4ee656-0740-4203-98f1-7147eea6493d	https://placehold.co/600x400?text=Note+1	0
940a12b8-bf7f-4730-ba7a-d7af6c9cdcf4	c3c34ff8-2fe7-4989-9417-67e6aa4cc441	https://placehold.co/600x400?text=Prius+1	0
9f8226fc-9e48-4787-a02d-6930606d24f4	c3c34ff8-2fe7-4989-9417-67e6aa4cc441	https://placehold.co/600x400?text=Prius+2	1
f37dc973-c6d3-4115-8afa-6d0e349be496	dad934df-a23a-4bc0-b30e-fb27621dfb08	https://placehold.co/600x400?text=Note+1	0
774b9bf1-98a6-48f4-9859-1ddf1c7fd596	fe1d7112-9125-45d5-9ea3-6205448d941f	https://placehold.co/600x400?text=Prius+1	0
25733a86-9853-49af-b956-a034cc952dc5	fe1d7112-9125-45d5-9ea3-6205448d941f	https://placehold.co/600x400?text=Prius+2	1
f639f5be-3961-4c75-bfbc-5b5205aa88bf	00139d8c-15e4-4bf0-9487-75de4549fac1	https://placehold.co/600x400?text=Note+1	0
dbc9acbd-9af9-42b3-831a-d77cd46add67	63513577-f2a3-43c3-9f01-3222e00dac36	https://placehold.co/600x400?text=Prius+1	0
c7ef3bd4-ad7f-4da8-8ab3-72e91735e680	63513577-f2a3-43c3-9f01-3222e00dac36	https://placehold.co/600x400?text=Prius+2	1
1619a9e6-c3a4-4168-bfa5-2f17d2ef0499	99e2b891-49bb-4476-bc47-90ad7bdd8060	https://placehold.co/600x400?text=Note+1	0
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f2e51ff0-e120-4287-a4f3-4ba3723d242f	80a68407b90ca1e20cba632a9703d2a59b84c299f028785733c7eb984e9a3d01	2025-11-07 05:47:51.812216+00	20251107054751_init	\N	\N	2025-11-07 05:47:51.720946+00	1
\.


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VehicleImage VehicleImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleImage"
    ADD CONSTRAINT "VehicleImage_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Payment_bookingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_bookingId_key" ON public."Payment" USING btree ("bookingId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VehicleImage VehicleImage_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleImage"
    ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict k1Q3omlkOBNk3fa5us4tUK96WUKQIVmukkNedmgcKdgkZJhHi1nwU0NcbHbFUMY

