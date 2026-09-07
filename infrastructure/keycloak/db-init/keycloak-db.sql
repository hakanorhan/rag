--
-- PostgreSQL database dump
--

\restrict 1fqGeaHvNHjDRz0DeDGddwOWgHruoWcFNuRcLczB6zM6hQURJ6zB6IapdMxoJ95

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

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
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64),
    details_json text
);


--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


--
-- Name: auth_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_session (
    root_auth_session_id character varying(36) NOT NULL,
    tab_id character varying(36) NOT NULL,
    client_uuid character varying(255),
    auth_user_id character varying(255),
    "timestamp" bigint,
    version integer,
    redirect_uri text,
    action character varying(255),
    protocol character varying(255),
    client_scopes text,
    execution_status text,
    client_notes text,
    auth_notes text,
    required_actions text,
    user_session_notes text
);


--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authenticator_config (
    id character varying(36) CONSTRAINT authenticator_id_not_null NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) CONSTRAINT authenticator_config_authenticator_id_not_null NOT NULL,
    value text,
    name character varying(255) CONSTRAINT authenticator_config_name_not_null NOT NULL
);


--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


--
-- Name: client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL,
    created_timestamp bigint,
    last_modified_timestamp bigint
);


--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) CONSTRAINT app_node_registrations_application_id_not_null NOT NULL,
    value integer,
    name character varying(255) CONSTRAINT app_node_registrations_name_not_null NOT NULL
);


--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope (
    id character varying(36) CONSTRAINT client_template_id_not_null NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) CONSTRAINT client_template_attributes_template_id_not_null NOT NULL,
    value character varying(2048),
    name character varying(255) CONSTRAINT client_template_attributes_name_not_null NOT NULL
);


--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) CONSTRAINT template_scope_mapping_template_id_not_null NOT NULL,
    role_id character varying(36) CONSTRAINT template_scope_mapping_role_id_not_null NOT NULL
);


--
-- Name: cluster_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cluster_event (
    id character varying(36) NOT NULL,
    target_cluster character varying(200) NOT NULL,
    sender_cluster character varying(200) NOT NULL,
    event_data oid NOT NULL,
    created_at bigint NOT NULL
);


--
-- Name: component; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


--
-- Name: component_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


--
-- Name: credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer,
    version integer DEFAULT 0
);


--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255),
    details_json_long_value text
);


--
-- Name: fed_issued_ver_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_issued_ver_credential (
    id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36) NOT NULL,
    ver_credential_id character varying(36) NOT NULL,
    issued_at bigint NOT NULL,
    expires_at bigint,
    client_id character varying(36),
    revision character varying(36) NOT NULL
);


--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024),
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    parameter character varying(255) DEFAULT '#N A#'::character varying NOT NULL
);


--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: fed_user_ver_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_ver_credential (
    id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    client_scope_id character varying(36) NOT NULL,
    revision character varying(36) NOT NULL,
    user_attributes text,
    created_date bigint,
    updated_date bigint,
    version integer DEFAULT 0 NOT NULL
);


--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean,
    authenticate_by_default boolean,
    realm_id character varying(36),
    add_token_role boolean,
    trust_email boolean,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean,
    organization_id character varying(255),
    hide_on_login boolean
);


--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: issued_ver_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issued_ver_credential (
    id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    ver_credential_id character varying(36) NOT NULL,
    issued_at bigint NOT NULL,
    expires_at bigint,
    client_id character varying(36),
    revision character varying(36) NOT NULL
);


--
-- Name: jgroups_ping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jgroups_ping (
    address character varying(200) NOT NULL,
    name character varying(200),
    cluster_name character varying(200) NOT NULL,
    ip character varying(200) NOT NULL,
    coord boolean,
    last_update bigint,
    coordinated_by character varying(200)
);


--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36),
    type integer DEFAULT 0 NOT NULL,
    description character varying(255),
    org_id character varying(255),
    created_timestamp bigint,
    last_modified_timestamp bigint
);


--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false CONSTRAINT keycloak_role_application_role_not_null NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


--
-- Name: login_failure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_failure (
    realm_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    failed_login_not_before bigint DEFAULT 0,
    num_failures integer DEFAULT 0,
    num_temporary_lockouts integer DEFAULT 0,
    last_failure bigint DEFAULT 0,
    last_ip_failure character varying(255),
    num_secondary_auth_failures integer DEFAULT 0
);


--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL,
    version integer DEFAULT 0,
    realm_id character varying(36)
);


--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL,
    broker_session_id character varying(1024),
    version integer DEFAULT 0,
    remember_me boolean
);


--
-- Name: org; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.org (
    id character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    realm_id character varying(255) NOT NULL,
    group_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(4000),
    alias character varying(255) NOT NULL,
    redirect_url character varying(2048)
);


--
-- Name: org_domain; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.org_domain (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    verified boolean NOT NULL,
    org_id character varying(255) NOT NULL
);


--
-- Name: org_invitation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.org_invitation (
    id character varying(36) NOT NULL,
    organization_id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    created_at integer NOT NULL,
    expires_at integer,
    invite_link character varying(2048)
);


--
-- Name: outbox_entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outbox_entry (
    id character varying(36) NOT NULL,
    entry_kind character varying(64) NOT NULL,
    realm_id character varying(36) NOT NULL,
    owner_id character varying(64) NOT NULL,
    container_id character varying(64),
    correlation_id character varying(255) NOT NULL,
    entry_type character varying(256) NOT NULL,
    payload text NOT NULL,
    metadata text,
    status character varying(16) NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    next_attempt_at timestamp without time zone NOT NULL,
    last_error character varying(2048),
    created_at timestamp without time zone NOT NULL,
    delivered_at timestamp without time zone
);


--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: realm; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255),
    display_name character varying(255)
);


--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server (
    id character varying(36) CONSTRAINT resource_server_client_id_not_null NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) CONSTRAINT resource_server_policy_resource_server_client_id_not_null NOT NULL,
    owner character varying(255)
);


--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) CONSTRAINT resource_server_resource_resource_server_client_id_not_null NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) CONSTRAINT resource_server_scope_resource_server_client_id_not_null NOT NULL,
    display_name character varying(255)
);


--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: revoked_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revoked_token (
    id character varying(255) NOT NULL,
    expire bigint NOT NULL
);


--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


--
-- Name: root_auth_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.root_auth_session (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" bigint,
    version integer
);


--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


--
-- Name: server_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.server_config (
    server_config_key character varying(255) NOT NULL,
    value text NOT NULL,
    version integer DEFAULT 0
);


--
-- Name: single_use_object; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.single_use_object (
    id character varying(255) NOT NULL,
    notes text,
    expire bigint NOT NULL
);


--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    parameter character varying(255) DEFAULT '#N A#'::character varying NOT NULL
);


--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL,
    last_modified_timestamp bigint
);


--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) CONSTRAINT user_federation_mapper_confi_user_federation_mapper_id_not_null NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    membership_type character varying(255) NOT NULL
);


--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


--
-- Name: user_ver_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_ver_credential (
    id character varying(36) NOT NULL,
    client_scope_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    revision character varying(36) NOT NULL,
    created_date bigint,
    updated_date bigint,
    user_attributes text,
    version integer
);


--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: workflow_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workflow_state (
    execution_id character varying(255) NOT NULL,
    resource_id character varying(255) NOT NULL,
    workflow_id character varying(255) NOT NULL,
    resource_type character varying(255),
    scheduled_step_id character varying(255),
    scheduled_step_timestamp bigint
);


--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type, details_json) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: auth_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_session (root_auth_session_id, tab_id, client_uuid, auth_user_id, "timestamp", version, redirect_uri, action, protocol, client_scopes, execution_status, client_notes, auth_notes, required_actions, user_session_notes) FROM stdin;
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
55b5fc76-409a-4554-a39c-d16d2c556334	\N	idp-email-verification	aaddfc62-6c65-40bc-b197-99e305da29de	33abb79a-be0b-40ec-8ee0-24970c570b0c	2	10	f	\N	\N
f1bfd1f7-efeb-4c45-8095-8561e9c42a4f	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	33abb79a-be0b-40ec-8ee0-24970c570b0c	2	20	t	59806e55-ff57-4e8c-8c96-71899f279855	\N
b34701d8-754b-411b-bf4c-6015a9bc25f6	\N	conditional-user-configured	aaddfc62-6c65-40bc-b197-99e305da29de	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	0	10	f	\N	\N
b93cabad-0586-4860-b951-8fa0c1c3a256	\N	conditional-credential	aaddfc62-6c65-40bc-b197-99e305da29de	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	0	20	f	\N	3c04953d-d538-47d8-b73a-2fc2bd0a8f30
660a3377-3abd-4a6d-989d-a4c408e11d07	\N	auth-otp-form	aaddfc62-6c65-40bc-b197-99e305da29de	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	2	30	f	\N	\N
77f09414-6186-4d44-8f38-4551e61e819d	\N	webauthn-authenticator	aaddfc62-6c65-40bc-b197-99e305da29de	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	3	40	f	\N	\N
fefb7509-36f5-40ac-a5b4-6bb1c927dff3	\N	auth-recovery-authn-code-form	aaddfc62-6c65-40bc-b197-99e305da29de	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	3	50	f	\N	\N
ed39f6f9-17fd-4cb1-bb5c-a9e3fed3059d	\N	conditional-user-configured	aaddfc62-6c65-40bc-b197-99e305da29de	03ce33e9-f492-4324-8e73-f4ef3af5f50b	0	10	f	\N	\N
13398f6b-72cf-403a-b79b-a17c54de2a59	\N	direct-grant-validate-otp	aaddfc62-6c65-40bc-b197-99e305da29de	03ce33e9-f492-4324-8e73-f4ef3af5f50b	0	20	f	\N	\N
9ba61204-0db6-4a32-a22d-9815761e8ddf	\N	conditional-user-configured	aaddfc62-6c65-40bc-b197-99e305da29de	e49bf07e-5df2-4b83-8471-e6ca59f92043	0	10	f	\N	\N
907de403-f195-43cd-ac25-f81372eca029	\N	conditional-credential	aaddfc62-6c65-40bc-b197-99e305da29de	e49bf07e-5df2-4b83-8471-e6ca59f92043	0	20	f	\N	ca733035-67e9-4e4e-a8df-b6e5a463cf80
f47117e5-2167-48b9-a921-6a5ac63689ee	\N	auth-otp-form	aaddfc62-6c65-40bc-b197-99e305da29de	e49bf07e-5df2-4b83-8471-e6ca59f92043	2	30	f	\N	\N
bb35dbf9-8edf-4ab5-ac1a-9e475b3deaf1	\N	webauthn-authenticator	aaddfc62-6c65-40bc-b197-99e305da29de	e49bf07e-5df2-4b83-8471-e6ca59f92043	3	40	f	\N	\N
7952da45-e9b7-49cf-b389-59c366ee1de9	\N	auth-recovery-authn-code-form	aaddfc62-6c65-40bc-b197-99e305da29de	e49bf07e-5df2-4b83-8471-e6ca59f92043	3	50	f	\N	\N
67325bf6-f84e-4a4c-8dff-4b5fc5850e71	\N	idp-confirm-link	aaddfc62-6c65-40bc-b197-99e305da29de	5ffdd551-ab55-4ed5-ad72-60dc29bd3a19	0	10	f	\N	\N
e76d5b34-9a1f-45bb-a2a8-90db501ad290	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	5ffdd551-ab55-4ed5-ad72-60dc29bd3a19	0	20	t	33abb79a-be0b-40ec-8ee0-24970c570b0c	\N
c4a746a7-dd8c-458f-b8ce-454755cfd7bb	\N	conditional-user-configured	aaddfc62-6c65-40bc-b197-99e305da29de	7861125f-61f8-4af8-8373-53ee363c7da6	0	10	f	\N	\N
894e574f-4fed-4525-ad9f-c35e82a1cd60	\N	reset-otp	aaddfc62-6c65-40bc-b197-99e305da29de	7861125f-61f8-4af8-8373-53ee363c7da6	0	20	f	\N	\N
de0fb00c-0a80-4153-aee8-f8f680f0f59d	\N	idp-create-user-if-unique	aaddfc62-6c65-40bc-b197-99e305da29de	760e0fe8-b567-4616-adfc-a394523f4544	2	10	f	\N	458a39e1-273c-491c-bdcf-0050a40856a3
f03b1270-3223-401a-b7a3-9c5216728412	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	760e0fe8-b567-4616-adfc-a394523f4544	2	20	t	5ffdd551-ab55-4ed5-ad72-60dc29bd3a19	\N
cad8e1f1-37a6-427d-81d2-6a38d52fceec	\N	idp-username-password-form	aaddfc62-6c65-40bc-b197-99e305da29de	59806e55-ff57-4e8c-8c96-71899f279855	0	10	f	\N	\N
69771189-0246-41f2-bbce-ad60b2ce2760	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	59806e55-ff57-4e8c-8c96-71899f279855	1	20	t	e49bf07e-5df2-4b83-8471-e6ca59f92043	\N
31960ebc-fcaf-49b8-a432-34422d9c8819	\N	auth-cookie	aaddfc62-6c65-40bc-b197-99e305da29de	7242da42-1481-40a1-b3d6-3cf71c5b4af0	2	10	f	\N	\N
2a06951b-10cb-42d2-8d35-97fc5334e0d0	\N	auth-spnego	aaddfc62-6c65-40bc-b197-99e305da29de	7242da42-1481-40a1-b3d6-3cf71c5b4af0	3	20	f	\N	\N
6a4291be-e601-4098-9593-788e8368a1d5	\N	identity-provider-redirector	aaddfc62-6c65-40bc-b197-99e305da29de	7242da42-1481-40a1-b3d6-3cf71c5b4af0	2	25	f	\N	\N
b21321e3-d3cb-478c-bc51-d278ef9287d8	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	7242da42-1481-40a1-b3d6-3cf71c5b4af0	2	30	t	12be1056-95c0-4e1b-a060-76eb3e040bd9	\N
58cc8781-3f85-49c7-a158-3e95b380e18b	\N	client-secret	aaddfc62-6c65-40bc-b197-99e305da29de	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2	10	f	\N	\N
68f887d9-6187-4752-9f53-e56a873bcb20	\N	client-jwt	aaddfc62-6c65-40bc-b197-99e305da29de	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2	20	f	\N	\N
09580106-2172-4c6c-86e5-9a20e2cb4543	\N	client-secret-jwt	aaddfc62-6c65-40bc-b197-99e305da29de	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2	30	f	\N	\N
6b39d0e3-6c70-4a2e-8d54-c2e49097fc04	\N	client-x509	aaddfc62-6c65-40bc-b197-99e305da29de	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2	40	f	\N	\N
64a33c76-1cd5-4d94-bb90-fa37596b2f66	\N	federated-jwt	aaddfc62-6c65-40bc-b197-99e305da29de	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2	50	f	\N	\N
151079d3-fdae-420b-bf3d-c2162bc5c095	\N	direct-grant-validate-username	aaddfc62-6c65-40bc-b197-99e305da29de	3122ecab-cc15-4fd6-9ab3-c0b7fcc4abac	0	10	f	\N	\N
a02df8d1-ac79-4ca6-9c55-dc6a5aebde6d	\N	direct-grant-validate-password	aaddfc62-6c65-40bc-b197-99e305da29de	3122ecab-cc15-4fd6-9ab3-c0b7fcc4abac	0	20	f	\N	\N
7fa5404b-f4c0-4bc3-809a-00c24595f370	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	3122ecab-cc15-4fd6-9ab3-c0b7fcc4abac	1	30	t	03ce33e9-f492-4324-8e73-f4ef3af5f50b	\N
f126a5dc-aad6-41a6-a2ff-3875e7d6bb7e	\N	docker-http-basic-authenticator	aaddfc62-6c65-40bc-b197-99e305da29de	840fb855-fdf6-4b22-a3d7-e29f3ea758d1	0	10	f	\N	\N
cbc42913-4f14-4232-b8a4-97acc6791cac	\N	idp-review-profile	aaddfc62-6c65-40bc-b197-99e305da29de	b8f58e12-21d8-4929-8d86-336435f5f4a7	0	10	f	\N	279020d8-326b-4776-9e02-66bf64b6c0b4
9264e9a7-7b43-445a-83e1-2bb16948ec84	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	b8f58e12-21d8-4929-8d86-336435f5f4a7	0	20	t	760e0fe8-b567-4616-adfc-a394523f4544	\N
16bcfa13-e863-4660-a3a3-67ef692c8853	\N	auth-username-password-form	aaddfc62-6c65-40bc-b197-99e305da29de	12be1056-95c0-4e1b-a060-76eb3e040bd9	0	10	f	\N	\N
78e626e0-a432-421b-846b-aa622885e6f1	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	12be1056-95c0-4e1b-a060-76eb3e040bd9	1	20	t	4f1a80de-78d8-4edc-8592-3c3f3d3c907d	\N
ddce4852-2acd-4098-8497-f8c8a74719ef	\N	registration-page-form	aaddfc62-6c65-40bc-b197-99e305da29de	eee438a4-d81e-45d2-a249-39572490bea8	0	10	t	e7f89073-8d20-4272-abbb-7c60f7c95531	\N
b5fcbc85-fbf3-4f41-8066-1086b5f9bf5b	\N	registration-user-creation	aaddfc62-6c65-40bc-b197-99e305da29de	e7f89073-8d20-4272-abbb-7c60f7c95531	0	20	f	\N	\N
f6b72320-50bd-4f56-9ab5-b035dc322136	\N	registration-password-action	aaddfc62-6c65-40bc-b197-99e305da29de	e7f89073-8d20-4272-abbb-7c60f7c95531	0	50	f	\N	\N
34cba8c9-1b6f-4868-b5bc-0dccc30494f6	\N	registration-recaptcha-action	aaddfc62-6c65-40bc-b197-99e305da29de	e7f89073-8d20-4272-abbb-7c60f7c95531	3	60	f	\N	\N
dad5c0b7-2d81-4747-9611-2789c4967440	\N	registration-terms-and-conditions	aaddfc62-6c65-40bc-b197-99e305da29de	e7f89073-8d20-4272-abbb-7c60f7c95531	3	70	f	\N	\N
595fce48-b99e-4520-9d35-f8dffc016669	\N	reset-credentials-choose-user	aaddfc62-6c65-40bc-b197-99e305da29de	2296fa53-ff28-410f-befb-3dedd959a6d1	0	10	f	\N	\N
4b5ea0ee-db45-4003-bbc7-63af4c0df123	\N	reset-credential-email	aaddfc62-6c65-40bc-b197-99e305da29de	2296fa53-ff28-410f-befb-3dedd959a6d1	0	20	f	\N	\N
c030c07c-2ac4-4ec8-a3ec-b731f06e92c5	\N	reset-password	aaddfc62-6c65-40bc-b197-99e305da29de	2296fa53-ff28-410f-befb-3dedd959a6d1	0	30	f	\N	\N
66d62589-3fbd-43c0-bd47-25757724153f	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	2296fa53-ff28-410f-befb-3dedd959a6d1	1	40	t	7861125f-61f8-4af8-8373-53ee363c7da6	\N
fa52f6b0-1a6e-4da8-9d24-aa71db1c1ae2	\N	http-basic-authenticator	aaddfc62-6c65-40bc-b197-99e305da29de	60120414-dbb5-45a1-aa4f-6815d13fe4bb	0	10	f	\N	\N
c2db2fee-6e80-4913-b716-bfb81c305c6a	\N	idp-email-verification	0b379a43-608e-4ff3-aaf5-6106d6df4979	337aad53-0d2a-48bd-bbbc-eb9b3f65dbf8	2	10	f	\N	\N
780f7a7b-2c78-41c7-aca7-ccac45f9c860	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	337aad53-0d2a-48bd-bbbc-eb9b3f65dbf8	2	20	t	dac94631-e61c-48ac-8643-41b03b49e58a	\N
dfcbf0c3-566f-4c00-bb59-af8f7ab00e49	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	29f05bf9-6103-40cc-ac13-36640f7ef120	0	10	f	\N	\N
92e61628-1263-4eea-ae75-4b32ed6245ac	\N	conditional-credential	0b379a43-608e-4ff3-aaf5-6106d6df4979	29f05bf9-6103-40cc-ac13-36640f7ef120	0	20	f	\N	8d0405a8-f640-4f07-823d-12824af6aea0
02da3a79-b0f1-4fe8-9eed-faef9526bc8d	\N	auth-otp-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	29f05bf9-6103-40cc-ac13-36640f7ef120	2	30	f	\N	\N
0b2c71ec-a1f5-43aa-b54a-7c26dec2604d	\N	webauthn-authenticator	0b379a43-608e-4ff3-aaf5-6106d6df4979	29f05bf9-6103-40cc-ac13-36640f7ef120	3	40	f	\N	\N
ea96386d-fa85-4a30-b24a-59c12e99fa07	\N	auth-recovery-authn-code-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	29f05bf9-6103-40cc-ac13-36640f7ef120	3	50	f	\N	\N
084a363a-a615-48b0-8e35-d2d76059ffdd	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	534eab02-85a6-4074-b4d5-33ade07cfa0d	0	10	f	\N	\N
ea0f1da8-2e7d-4db6-b5b8-89f2a9ab7758	\N	organization	0b379a43-608e-4ff3-aaf5-6106d6df4979	534eab02-85a6-4074-b4d5-33ade07cfa0d	2	20	f	\N	\N
de957691-bd53-4d73-922f-702ffbc3c9a3	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	1779e0da-500e-4fe4-aebe-d173aed28656	0	10	f	\N	\N
d57ba67d-54fd-4769-bff7-dead0ab012c3	\N	direct-grant-validate-otp	0b379a43-608e-4ff3-aaf5-6106d6df4979	1779e0da-500e-4fe4-aebe-d173aed28656	0	20	f	\N	\N
6ba0cfee-447d-4601-bdab-a6793198b105	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	c0f937c8-876f-4457-bf68-f4b024e28ca6	0	10	f	\N	\N
d4eb5a5f-9fb6-4ba3-9eed-73726cc4a28c	\N	idp-add-organization-member	0b379a43-608e-4ff3-aaf5-6106d6df4979	c0f937c8-876f-4457-bf68-f4b024e28ca6	0	20	f	\N	\N
387c5784-1afe-45ec-a41d-b7e2b3ba5c10	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	4aec8a33-30e3-40b6-9015-c81ecb41f60e	0	10	f	\N	\N
8e314bb9-bf26-49eb-bf2c-3442fc2a2109	\N	conditional-credential	0b379a43-608e-4ff3-aaf5-6106d6df4979	4aec8a33-30e3-40b6-9015-c81ecb41f60e	0	20	f	\N	22339f80-101c-493f-b259-3db6a680eae8
8a0b98e7-0490-4f78-8fe1-c2d42d7ca5c1	\N	auth-otp-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	4aec8a33-30e3-40b6-9015-c81ecb41f60e	2	30	f	\N	\N
56dda5f7-8371-4c52-b082-70d14da9b551	\N	webauthn-authenticator	0b379a43-608e-4ff3-aaf5-6106d6df4979	4aec8a33-30e3-40b6-9015-c81ecb41f60e	3	40	f	\N	\N
29c79327-16cd-46be-9ec9-d9de9da235d6	\N	auth-recovery-authn-code-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	4aec8a33-30e3-40b6-9015-c81ecb41f60e	3	50	f	\N	\N
a34ffc31-b92e-47b8-afea-4bf1a2731d09	\N	idp-confirm-link	0b379a43-608e-4ff3-aaf5-6106d6df4979	9d90880c-ae50-4814-980e-898a0864b4eb	0	10	f	\N	\N
7dfe915d-cad1-4a1e-8f68-816f039d0671	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	9d90880c-ae50-4814-980e-898a0864b4eb	0	20	t	337aad53-0d2a-48bd-bbbc-eb9b3f65dbf8	\N
721cbd29-0f7d-4174-a43f-e4b137c16c2b	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	35529d72-17db-41c2-8c46-d2d0e1f74641	1	10	t	534eab02-85a6-4074-b4d5-33ade07cfa0d	\N
f1d001c9-8e0a-49e2-b6dd-03065c9087d0	\N	conditional-user-configured	0b379a43-608e-4ff3-aaf5-6106d6df4979	5ed164d7-fb0e-4415-ba0e-1d6d501679af	0	10	f	\N	\N
17adbf6f-8619-4c2d-af8b-044953ae2f9b	\N	reset-otp	0b379a43-608e-4ff3-aaf5-6106d6df4979	5ed164d7-fb0e-4415-ba0e-1d6d501679af	0	20	f	\N	\N
e22e2940-ecaa-477a-aa2d-dfa512452817	\N	idp-create-user-if-unique	0b379a43-608e-4ff3-aaf5-6106d6df4979	cd3dced9-824f-4c69-abba-7ef4946e5736	2	10	f	\N	87b7340a-65a9-47a1-8e47-e9403b6a6374
53eaa331-a002-483d-911c-76c113e32f6b	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	cd3dced9-824f-4c69-abba-7ef4946e5736	2	20	t	9d90880c-ae50-4814-980e-898a0864b4eb	\N
9d3201ed-17b0-42bb-a175-ad5b54d66276	\N	idp-username-password-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	dac94631-e61c-48ac-8643-41b03b49e58a	0	10	f	\N	\N
b8c020ce-2c1d-4975-a2b8-7eef06694e8f	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	dac94631-e61c-48ac-8643-41b03b49e58a	1	20	t	4aec8a33-30e3-40b6-9015-c81ecb41f60e	\N
4d695a8b-0218-4b80-ad9d-462e5bc52ce0	\N	auth-cookie	0b379a43-608e-4ff3-aaf5-6106d6df4979	e25308d0-9a81-419f-b97a-a7c7bd64efa1	2	10	f	\N	\N
9130d66a-aa41-4b74-a76c-9dd2409d2734	\N	auth-spnego	0b379a43-608e-4ff3-aaf5-6106d6df4979	e25308d0-9a81-419f-b97a-a7c7bd64efa1	3	20	f	\N	\N
2cbe95ee-6350-460d-bb93-be51aebdc646	\N	identity-provider-redirector	0b379a43-608e-4ff3-aaf5-6106d6df4979	e25308d0-9a81-419f-b97a-a7c7bd64efa1	2	25	f	\N	\N
43ac4dae-9228-4fcf-a50a-9786d7deaaca	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	e25308d0-9a81-419f-b97a-a7c7bd64efa1	2	26	t	35529d72-17db-41c2-8c46-d2d0e1f74641	\N
98459e45-2203-4e58-888a-4c723b6ce60f	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	e25308d0-9a81-419f-b97a-a7c7bd64efa1	2	30	t	9189b2a6-a14e-4928-b775-8b135f8a6378	\N
f6c55546-23fc-4e43-95ac-ccdccd4a1af0	\N	client-secret	0b379a43-608e-4ff3-aaf5-6106d6df4979	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2	10	f	\N	\N
1d1a3bbb-255b-421c-ae5e-725247cf481e	\N	client-jwt	0b379a43-608e-4ff3-aaf5-6106d6df4979	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2	20	f	\N	\N
60ee6e08-d048-43e4-89b5-bbe4f3407ac3	\N	client-secret-jwt	0b379a43-608e-4ff3-aaf5-6106d6df4979	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2	30	f	\N	\N
9784b163-477c-4761-ae2e-1efdbae17161	\N	client-x509	0b379a43-608e-4ff3-aaf5-6106d6df4979	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2	40	f	\N	\N
65d08f91-2310-4b9a-a4f1-6e52f5307b0b	\N	federated-jwt	0b379a43-608e-4ff3-aaf5-6106d6df4979	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2	50	f	\N	\N
b13db49a-a112-4aa7-ab1b-6532c88842f7	\N	direct-grant-validate-username	0b379a43-608e-4ff3-aaf5-6106d6df4979	64cedb2e-9cda-4dd9-a33d-57d4232ad345	0	10	f	\N	\N
07ba71f5-a502-466b-a621-1b5e13745f34	\N	direct-grant-validate-password	0b379a43-608e-4ff3-aaf5-6106d6df4979	64cedb2e-9cda-4dd9-a33d-57d4232ad345	0	20	f	\N	\N
1e9efd1a-a502-42fa-affb-5848aa7b22d6	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	64cedb2e-9cda-4dd9-a33d-57d4232ad345	1	30	t	1779e0da-500e-4fe4-aebe-d173aed28656	\N
a03e3e3e-7629-4f1c-80b1-d2c5484b75ef	\N	docker-http-basic-authenticator	0b379a43-608e-4ff3-aaf5-6106d6df4979	0cb648a5-9ca8-4d62-8664-86abe4cf2aa2	0	10	f	\N	\N
3c52b633-44e3-4381-802c-e03e8268fe87	\N	idp-review-profile	0b379a43-608e-4ff3-aaf5-6106d6df4979	9593e783-3df0-421d-8d7d-724813afbcf3	0	10	f	\N	aed01674-1e4a-4c67-ac1a-4644ba10e22d
29eef148-3e62-4e89-93c6-e1f2742c77dc	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	9593e783-3df0-421d-8d7d-724813afbcf3	0	20	t	cd3dced9-824f-4c69-abba-7ef4946e5736	\N
e0e2c3a1-1d74-48f3-b74b-791238960eaf	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	9593e783-3df0-421d-8d7d-724813afbcf3	1	60	t	c0f937c8-876f-4457-bf68-f4b024e28ca6	\N
7eb23c02-b34f-4740-b598-667dd8665d1c	\N	auth-username-password-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	9189b2a6-a14e-4928-b775-8b135f8a6378	0	10	f	\N	\N
2436231d-2520-4572-9a7c-2e9157acbbb0	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	9189b2a6-a14e-4928-b775-8b135f8a6378	1	20	t	29f05bf9-6103-40cc-ac13-36640f7ef120	\N
f3882d57-6d15-4268-a7be-9c587ff7d8d3	\N	registration-page-form	0b379a43-608e-4ff3-aaf5-6106d6df4979	cdfca0ee-ae82-4bbd-abea-a7e14808ba83	0	10	t	c74d6cb9-187d-4e8e-ba51-d91d3df02032	\N
3522cee5-62c6-457c-8e8d-12246d37f6db	\N	registration-user-creation	0b379a43-608e-4ff3-aaf5-6106d6df4979	c74d6cb9-187d-4e8e-ba51-d91d3df02032	0	20	f	\N	\N
12c8f50f-6d99-4bcf-bc0f-0dc796125cb4	\N	registration-password-action	0b379a43-608e-4ff3-aaf5-6106d6df4979	c74d6cb9-187d-4e8e-ba51-d91d3df02032	0	50	f	\N	\N
25bb604c-810b-4468-8669-da41b6966ba0	\N	registration-recaptcha-action	0b379a43-608e-4ff3-aaf5-6106d6df4979	c74d6cb9-187d-4e8e-ba51-d91d3df02032	3	60	f	\N	\N
c70000f0-173a-47d1-af3c-6ea5c84fef57	\N	registration-terms-and-conditions	0b379a43-608e-4ff3-aaf5-6106d6df4979	c74d6cb9-187d-4e8e-ba51-d91d3df02032	3	70	f	\N	\N
3185f0b5-f6c2-4400-a078-7a1bd706ed83	\N	reset-credentials-choose-user	0b379a43-608e-4ff3-aaf5-6106d6df4979	34a57485-9f1b-4196-bf76-18ad610397d6	0	10	f	\N	\N
5fb9e39e-350e-4818-95e3-080d542e65e0	\N	reset-credential-email	0b379a43-608e-4ff3-aaf5-6106d6df4979	34a57485-9f1b-4196-bf76-18ad610397d6	0	20	f	\N	\N
d8c9b199-8b5e-4190-9ceb-3ddc15e140fb	\N	reset-password	0b379a43-608e-4ff3-aaf5-6106d6df4979	34a57485-9f1b-4196-bf76-18ad610397d6	0	30	f	\N	\N
e53a14a1-dacd-40ac-a491-a3a5bd8080f3	\N	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	34a57485-9f1b-4196-bf76-18ad610397d6	1	40	t	5ed164d7-fb0e-4415-ba0e-1d6d501679af	\N
4ca656cd-5d13-4b46-b5e9-3882c4932130	\N	http-basic-authenticator	0b379a43-608e-4ff3-aaf5-6106d6df4979	d3d85a9f-70c4-400f-89ae-f94d2cac859c	0	10	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
33abb79a-be0b-40ec-8ee0-24970c570b0c	Account verification options	Method with which to verify the existing account	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
4f1a80de-78d8-4edc-8592-3c3f3d3c907d	Browser - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
03ce33e9-f492-4324-8e73-f4ef3af5f50b	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
e49bf07e-5df2-4b83-8471-e6ca59f92043	First broker login - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
5ffdd551-ab55-4ed5-ad72-60dc29bd3a19	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
7861125f-61f8-4af8-8373-53ee363c7da6	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
760e0fe8-b567-4616-adfc-a394523f4544	User creation or linking	Flow for the existing/non-existing user alternatives	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
59806e55-ff57-4e8c-8c96-71899f279855	Verify Existing Account by Re-authentication	Reauthentication of existing account	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
7242da42-1481-40a1-b3d6-3cf71c5b4af0	browser	Browser based authentication	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	clients	Base authentication for clients	aaddfc62-6c65-40bc-b197-99e305da29de	client-flow	t	t
3122ecab-cc15-4fd6-9ab3-c0b7fcc4abac	direct grant	OpenID Connect Resource Owner Grant	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
840fb855-fdf6-4b22-a3d7-e29f3ea758d1	docker auth	Used by Docker clients to authenticate against the IDP	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
b8f58e12-21d8-4929-8d86-336435f5f4a7	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
12be1056-95c0-4e1b-a060-76eb3e040bd9	forms	Username, password, otp and other auth forms.	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	f	t
eee438a4-d81e-45d2-a249-39572490bea8	registration	Registration flow	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
e7f89073-8d20-4272-abbb-7c60f7c95531	registration form	Registration form	aaddfc62-6c65-40bc-b197-99e305da29de	form-flow	f	t
2296fa53-ff28-410f-befb-3dedd959a6d1	reset credentials	Reset credentials for a user if they forgot their password or something	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
60120414-dbb5-45a1-aa4f-6815d13fe4bb	saml ecp	SAML ECP Profile Authentication Flow	aaddfc62-6c65-40bc-b197-99e305da29de	basic-flow	t	t
337aad53-0d2a-48bd-bbbc-eb9b3f65dbf8	Account verification options	Method with which to verify the existing account	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
29f05bf9-6103-40cc-ac13-36640f7ef120	Browser - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
534eab02-85a6-4074-b4d5-33ade07cfa0d	Browser - Conditional Organization	Flow to determine if the organization identity-first login is to be used	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
1779e0da-500e-4fe4-aebe-d173aed28656	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
c0f937c8-876f-4457-bf68-f4b024e28ca6	First Broker Login - Conditional Organization	Flow to determine if the authenticator that adds organization members is to be used	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
4aec8a33-30e3-40b6-9015-c81ecb41f60e	First broker login - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
9d90880c-ae50-4814-980e-898a0864b4eb	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
35529d72-17db-41c2-8c46-d2d0e1f74641	Organization	\N	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
5ed164d7-fb0e-4415-ba0e-1d6d501679af	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
cd3dced9-824f-4c69-abba-7ef4946e5736	User creation or linking	Flow for the existing/non-existing user alternatives	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
dac94631-e61c-48ac-8643-41b03b49e58a	Verify Existing Account by Re-authentication	Reauthentication of existing account	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
e25308d0-9a81-419f-b97a-a7c7bd64efa1	browser	Browser based authentication	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
4d7e8fa5-da3e-49fa-87d1-bc915734612a	clients	Base authentication for clients	0b379a43-608e-4ff3-aaf5-6106d6df4979	client-flow	t	t
64cedb2e-9cda-4dd9-a33d-57d4232ad345	direct grant	OpenID Connect Resource Owner Grant	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
0cb648a5-9ca8-4d62-8664-86abe4cf2aa2	docker auth	Used by Docker clients to authenticate against the IDP	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
9593e783-3df0-421d-8d7d-724813afbcf3	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
9189b2a6-a14e-4928-b775-8b135f8a6378	forms	Username, password, otp and other auth forms.	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	f	t
cdfca0ee-ae82-4bbd-abea-a7e14808ba83	registration	Registration flow	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
c74d6cb9-187d-4e8e-ba51-d91d3df02032	registration form	Registration form	0b379a43-608e-4ff3-aaf5-6106d6df4979	form-flow	f	t
34a57485-9f1b-4196-bf76-18ad610397d6	reset credentials	Reset credentials for a user if they forgot their password or something	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
d3d85a9f-70c4-400f-89ae-f94d2cac859c	saml ecp	SAML ECP Profile Authentication Flow	0b379a43-608e-4ff3-aaf5-6106d6df4979	basic-flow	t	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
3c04953d-d538-47d8-b73a-2fc2bd0a8f30	browser-conditional-credential	aaddfc62-6c65-40bc-b197-99e305da29de
458a39e1-273c-491c-bdcf-0050a40856a3	create unique user config	aaddfc62-6c65-40bc-b197-99e305da29de
ca733035-67e9-4e4e-a8df-b6e5a463cf80	first-broker-login-conditional-credential	aaddfc62-6c65-40bc-b197-99e305da29de
279020d8-326b-4776-9e02-66bf64b6c0b4	review profile config	aaddfc62-6c65-40bc-b197-99e305da29de
8d0405a8-f640-4f07-823d-12824af6aea0	browser-conditional-credential	0b379a43-608e-4ff3-aaf5-6106d6df4979
87b7340a-65a9-47a1-8e47-e9403b6a6374	create unique user config	0b379a43-608e-4ff3-aaf5-6106d6df4979
22339f80-101c-493f-b259-3db6a680eae8	first-broker-login-conditional-credential	0b379a43-608e-4ff3-aaf5-6106d6df4979
aed01674-1e4a-4c67-ac1a-4644ba10e22d	review profile config	0b379a43-608e-4ff3-aaf5-6106d6df4979
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
279020d8-326b-4776-9e02-66bf64b6c0b4	missing	update.profile.on.first.login
3c04953d-d538-47d8-b73a-2fc2bd0a8f30	webauthn-passwordless	credentials
458a39e1-273c-491c-bdcf-0050a40856a3	false	require.password.update.after.registration
ca733035-67e9-4e4e-a8df-b6e5a463cf80	webauthn-passwordless	credentials
22339f80-101c-493f-b259-3db6a680eae8	webauthn-passwordless	credentials
87b7340a-65a9-47a1-8e47-e9403b6a6374	false	require.password.update.after.registration
8d0405a8-f640-4f07-823d-12824af6aea0	webauthn-passwordless	credentials
aed01674-1e4a-4c67-ac1a-4644ba10e22d	missing	update.profile.on.first.login
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console, created_timestamp, last_modified_timestamp) FROM stdin;
b6749730-19c5-4539-b648-70b3d768d4a5	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f	1788533827834	1788533828074
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f	1788533827990	1788533828141
fc7ed42f-c156-4907-b0fb-cd723299c867	t	t	admin-cli	0	t	\N	\N	f	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f	1788533828119	1788533828168
43c32d49-0d14-470e-b663-988f6201d387	t	f	broker	0	f	pIXJxJFXx5oM1WLxsWHF1aQ6WU3xVEnxMYQ6fYAlAGa38ZXwWIWquGiCDFZyEd9T9BKpUNSEKNrHWQhA2isVcu	\N	t	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f	1788533828157	1788533828200
11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	f	master-realm	0	f	wDvXX9gq6fFHyqf6bRynPibOmRtETp0teydyT2utEAkTenYRbPSTkZU2ARCXcRofPt1bDsr9RgOS83idDWhuxW	\N	t	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f	1788533828185	1788533828240
131c275f-d8a5-45c6-bde6-be22cc8d1385	t	f	rag-realm	0	f	iEuzDbZdrpz1WMnkP7nRisiG3C9cbP6Vrf85Uq8Lpf7HCJGf0cDARaseu7AW5GMFMgc5jmnGDEzXwujaadqEVn	\N	t	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	rag Realm	f	client-secret	\N	\N	\N	t	f	f	f	1788533828227	1788533828266
13d7c309-40a4-4da8-96e4-d38563094724	t	t	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	aaddfc62-6c65-40bc-b197-99e305da29de	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f	1788533828291	1788533828327
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	f	account	0	t	\N	/realms/rag/account/	f	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f	1788533829387	1788533829436
af6f50f5-ba18-410b-9f03-544a93928f96	t	f	account-console	0	t	\N	/realms/rag/account/	f	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f	1788533829422	1788533829456
da9095a0-e66c-4fc1-90b9-e550827c1ee6	t	t	admin-cli	0	t	\N	\N	f	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f	1788533829448	1788533829475
b78d4c63-f8da-4b2f-9461-a549243d1209	t	f	broker	0	f	**********	\N	t	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f	1788533829467	1788533829491
160feab5-0797-49fb-a051-5a83bc344af9	t	t	carservice	0	f	B75DPw5NtQPmx53AFIZglx6QpYjMqL6ndSbwIdp1eaNK4JoMvi40ifzuNA6atlaJe00ursGaDIjUolXINCxXch		t	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	-1	f	f		f	client-secret	\N		\N	f	f	f	f	1788533829483	1788533829508
ac96be9b-608d-46f9-9c11-35c6b36e70c7	t	t	rag-next	0	f	FteWqr4hnG1gi0dCeUVY8wv6nOJ8xUW9nTtCWcqGtga1LUQ9TpCKYa272dw03bQL8EoWPaV9Qm4GOVDwf5WSQI	http://localhost	f	http://localhost	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	-1	t	f		f	client-secret	http://localhost		\N	t	f	f	f	1788533829500	1788533829513
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	f	realm-management	0	f	**********	\N	t	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f	1788533829519	1788533829544
519682a7-2e80-40dd-b373-d40041557f9c	t	t	security-admin-console	0	t	\N	/admin/rag/console/	f	\N	f	0b379a43-608e-4ff3-aaf5-6106d6df4979	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f	1788533829534	1788533829554
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
b6749730-19c5-4539-b648-70b3d768d4a5	realm_client	false
b6749730-19c5-4539-b648-70b3d768d4a5	post.logout.redirect.uris	+
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	realm_client	false
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	post.logout.redirect.uris	+
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	pkce.code.challenge.method	S256
fc7ed42f-c156-4907-b0fb-cd723299c867	realm_client	false
fc7ed42f-c156-4907-b0fb-cd723299c867	client.use.lightweight.access.token.enabled	true
fc7ed42f-c156-4907-b0fb-cd723299c867	post.logout.redirect.uris	+
43c32d49-0d14-470e-b663-988f6201d387	client.secret.creation.time	1788533828
43c32d49-0d14-470e-b663-988f6201d387	realm_client	true
43c32d49-0d14-470e-b663-988f6201d387	post.logout.redirect.uris	+
11977ab8-d817-442b-abe2-b1d5bdd95ce8	client.secret.creation.time	1788533828
11977ab8-d817-442b-abe2-b1d5bdd95ce8	realm_client	true
11977ab8-d817-442b-abe2-b1d5bdd95ce8	post.logout.redirect.uris	+
131c275f-d8a5-45c6-bde6-be22cc8d1385	client.secret.creation.time	1788533828
131c275f-d8a5-45c6-bde6-be22cc8d1385	realm_client	true
131c275f-d8a5-45c6-bde6-be22cc8d1385	post.logout.redirect.uris	+
13d7c309-40a4-4da8-96e4-d38563094724	realm_client	false
13d7c309-40a4-4da8-96e4-d38563094724	client.use.lightweight.access.token.enabled	true
13d7c309-40a4-4da8-96e4-d38563094724	post.logout.redirect.uris	+
13d7c309-40a4-4da8-96e4-d38563094724	pkce.code.challenge.method	S256
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	realm_client	false
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	post.logout.redirect.uris	+
af6f50f5-ba18-410b-9f03-544a93928f96	realm_client	false
af6f50f5-ba18-410b-9f03-544a93928f96	post.logout.redirect.uris	+
af6f50f5-ba18-410b-9f03-544a93928f96	pkce.code.challenge.method	S256
da9095a0-e66c-4fc1-90b9-e550827c1ee6	realm_client	false
da9095a0-e66c-4fc1-90b9-e550827c1ee6	client.use.lightweight.access.token.enabled	true
da9095a0-e66c-4fc1-90b9-e550827c1ee6	post.logout.redirect.uris	+
b78d4c63-f8da-4b2f-9461-a549243d1209	realm_client	true
b78d4c63-f8da-4b2f-9461-a549243d1209	client.secret.creation.time	1788441784
b78d4c63-f8da-4b2f-9461-a549243d1209	post.logout.redirect.uris	+
160feab5-0797-49fb-a051-5a83bc344af9	client.secret.creation.time	1788533829
160feab5-0797-49fb-a051-5a83bc344af9	realm_client	false
160feab5-0797-49fb-a051-5a83bc344af9	logout.confirmation.enabled	false
160feab5-0797-49fb-a051-5a83bc344af9	oidc.ciba.grant.enabled	false
160feab5-0797-49fb-a051-5a83bc344af9	backchannel.logout.session.required	true
160feab5-0797-49fb-a051-5a83bc344af9	standard.token.exchange.enabled	false
160feab5-0797-49fb-a051-5a83bc344af9	oauth2.jwt.authorization.grant.enabled	false
160feab5-0797-49fb-a051-5a83bc344af9	frontchannel.logout.session.required	true
160feab5-0797-49fb-a051-5a83bc344af9	oauth2.device.authorization.grant.enabled	false
160feab5-0797-49fb-a051-5a83bc344af9	display.on.consent.screen	false
160feab5-0797-49fb-a051-5a83bc344af9	backchannel.logout.revoke.offline.tokens	false
160feab5-0797-49fb-a051-5a83bc344af9	dpop.bound.access.tokens	false
160feab5-0797-49fb-a051-5a83bc344af9	post.logout.redirect.uris	+
ac96be9b-608d-46f9-9c11-35c6b36e70c7	logout.confirmation.enabled	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	client.secret.creation.time	1787830765
ac96be9b-608d-46f9-9c11-35c6b36e70c7	oauth2.jwt.authorization.grant.enabled	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	standard.token.exchange.enabled	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	frontchannel.logout.session.required	true
ac96be9b-608d-46f9-9c11-35c6b36e70c7	post.logout.redirect.uris	http://localhost/*
ac96be9b-608d-46f9-9c11-35c6b36e70c7	oauth2.device.authorization.grant.enabled	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	backchannel.logout.revoke.offline.tokens	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	realm_client	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	oidc.ciba.grant.enabled	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	backchannel.logout.session.required	true
ac96be9b-608d-46f9-9c11-35c6b36e70c7	display.on.consent.screen	false
ac96be9b-608d-46f9-9c11-35c6b36e70c7	pkce.code.challenge.method	S256
ac96be9b-608d-46f9-9c11-35c6b36e70c7	dpop.bound.access.tokens	false
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	realm_client	true
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	client.secret.creation.time	1788441784
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	post.logout.redirect.uris	+
519682a7-2e80-40dd-b373-d40041557f9c	realm_client	false
519682a7-2e80-40dd-b373-d40041557f9c	client.use.lightweight.access.token.enabled	true
519682a7-2e80-40dd-b373-d40041557f9c	post.logout.redirect.uris	+
519682a7-2e80-40dd-b373-d40041557f9c	pkce.code.challenge.method	S256
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	roles	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect scope for add user roles to the access token	openid-connect
b9970a0f-7bba-4ba6-8afb-ed51415dc128	microprofile-jwt	aaddfc62-6c65-40bc-b197-99e305da29de	Microprofile - JWT built-in scope	openid-connect
055566ba-981c-4e8f-b24d-aeaf28648839	acr	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
18d7c917-5c3e-405d-9c2e-9a6654757652	offline_access	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect built-in scope: offline_access	openid-connect
5551e1d0-c0e1-4b4b-ab91-4ed8a9e20fe5	AuthnContextClassRef	aaddfc62-6c65-40bc-b197-99e305da29de	AuthnContextClassRef Level of Authentiation	saml
313805c4-3f97-481d-8249-f8e26cf713bd	email	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect built-in scope: email	openid-connect
3abac829-4fda-4af1-987d-762dd251cbfe	address	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect built-in scope: address	openid-connect
c5583e46-5117-4a67-9bd7-dfafb54b8c82	role_list	aaddfc62-6c65-40bc-b197-99e305da29de	SAML role list	saml
9b6fac52-921d-4651-9576-2e6309ebad4d	profile	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect built-in scope: profile	openid-connect
b03f2e57-24ee-4881-9d81-914accf78412	service_account	aaddfc62-6c65-40bc-b197-99e305da29de	Specific scope for a client enabled for service accounts	openid-connect
dfca62de-1771-4178-9cfc-c554fd823903	organization	aaddfc62-6c65-40bc-b197-99e305da29de	Additional claims about the organization a subject belongs to	openid-connect
f5253e6c-2e4b-43a3-8d59-694de430a0da	web-origins	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect scope for add allowed web origins to the access token	openid-connect
89405ce4-bb8c-4171-9bab-b79eabdbb182	basic	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect scope for add all basic claims to the token	openid-connect
00354f55-d261-4796-b63c-70feb6baac24	saml_organization	aaddfc62-6c65-40bc-b197-99e305da29de	Organization Membership	saml
183350b2-cd79-4910-b9ba-12e0d22bd938	phone	aaddfc62-6c65-40bc-b197-99e305da29de	OpenID Connect built-in scope: phone	openid-connect
c45e8afc-e232-42b8-a6cb-d17551ddcc22	offline_access	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect built-in scope: offline_access	openid-connect
8e950914-3ed6-4aee-b800-ed853daa0561	phone	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect built-in scope: phone	openid-connect
9d9017a4-e7c9-44c6-b662-5b41132c2077	saml_organization	0b379a43-608e-4ff3-aaf5-6106d6df4979	Organization Membership	saml
052b5c14-ef41-4946-bfab-f5f4357b75d8	roles	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect scope for add user roles to the access token	openid-connect
be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	acr	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
4e7432a4-8c41-4eab-8d1e-156d4ee293b8	basic	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect scope for add all basic claims to the token	openid-connect
9904ff66-6dcd-464e-9c27-3211a5dce67e	email	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect built-in scope: email	openid-connect
2b676baf-8495-4862-9fde-f1d15341bcca	organization	0b379a43-608e-4ff3-aaf5-6106d6df4979	Additional claims about the organization a subject belongs to	openid-connect
0a4492f4-3fd9-451f-9e86-fcb9f299c013	role_list	0b379a43-608e-4ff3-aaf5-6106d6df4979	SAML role list	saml
2ec129e2-621c-448c-aec1-fd4bece19fdd	microprofile-jwt	0b379a43-608e-4ff3-aaf5-6106d6df4979	Microprofile - JWT built-in scope	openid-connect
d253a1f5-7599-410a-b32a-7eb3af9c27dc	AuthnContextClassRef	0b379a43-608e-4ff3-aaf5-6106d6df4979	AuthnContextClassRef Level of Authentiation	saml
dbd4f101-fe82-4a49-8c4b-a1d5aac1808a	service_account	0b379a43-608e-4ff3-aaf5-6106d6df4979	Specific scope for a client enabled for service accounts	openid-connect
8be62890-c805-4ed1-b779-90794f6b92b1	web-origins	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect scope for add allowed web origins to the access token	openid-connect
bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	profile	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect built-in scope: profile	openid-connect
5333a2c5-4889-427e-987c-72d11fd63a32	address	0b379a43-608e-4ff3-aaf5-6106d6df4979	OpenID Connect built-in scope: address	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	false	include.in.token.scope
3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	${rolesScopeConsentText}	consent.screen.text
3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	true	display.on.consent.screen
b9970a0f-7bba-4ba6-8afb-ed51415dc128	true	include.in.token.scope
b9970a0f-7bba-4ba6-8afb-ed51415dc128	false	display.on.consent.screen
055566ba-981c-4e8f-b24d-aeaf28648839	false	include.in.token.scope
055566ba-981c-4e8f-b24d-aeaf28648839	false	display.on.consent.screen
18d7c917-5c3e-405d-9c2e-9a6654757652	${offlineAccessScopeConsentText}	consent.screen.text
18d7c917-5c3e-405d-9c2e-9a6654757652	true	display.on.consent.screen
313805c4-3f97-481d-8249-f8e26cf713bd	true	include.in.token.scope
313805c4-3f97-481d-8249-f8e26cf713bd	${emailScopeConsentText}	consent.screen.text
313805c4-3f97-481d-8249-f8e26cf713bd	true	display.on.consent.screen
3abac829-4fda-4af1-987d-762dd251cbfe	true	include.in.token.scope
3abac829-4fda-4af1-987d-762dd251cbfe	${addressScopeConsentText}	consent.screen.text
3abac829-4fda-4af1-987d-762dd251cbfe	true	display.on.consent.screen
c5583e46-5117-4a67-9bd7-dfafb54b8c82	${samlRoleListScopeConsentText}	consent.screen.text
c5583e46-5117-4a67-9bd7-dfafb54b8c82	true	display.on.consent.screen
9b6fac52-921d-4651-9576-2e6309ebad4d	true	include.in.token.scope
9b6fac52-921d-4651-9576-2e6309ebad4d	${profileScopeConsentText}	consent.screen.text
9b6fac52-921d-4651-9576-2e6309ebad4d	true	display.on.consent.screen
b03f2e57-24ee-4881-9d81-914accf78412	false	include.in.token.scope
b03f2e57-24ee-4881-9d81-914accf78412	false	display.on.consent.screen
dfca62de-1771-4178-9cfc-c554fd823903	true	include.in.token.scope
dfca62de-1771-4178-9cfc-c554fd823903	${organizationScopeConsentText}	consent.screen.text
dfca62de-1771-4178-9cfc-c554fd823903	true	display.on.consent.screen
f5253e6c-2e4b-43a3-8d59-694de430a0da	false	include.in.token.scope
f5253e6c-2e4b-43a3-8d59-694de430a0da		consent.screen.text
f5253e6c-2e4b-43a3-8d59-694de430a0da	false	display.on.consent.screen
89405ce4-bb8c-4171-9bab-b79eabdbb182	false	include.in.token.scope
89405ce4-bb8c-4171-9bab-b79eabdbb182	false	display.on.consent.screen
00354f55-d261-4796-b63c-70feb6baac24	false	display.on.consent.screen
183350b2-cd79-4910-b9ba-12e0d22bd938	true	include.in.token.scope
183350b2-cd79-4910-b9ba-12e0d22bd938	${phoneScopeConsentText}	consent.screen.text
183350b2-cd79-4910-b9ba-12e0d22bd938	true	display.on.consent.screen
c45e8afc-e232-42b8-a6cb-d17551ddcc22	${offlineAccessScopeConsentText}	consent.screen.text
c45e8afc-e232-42b8-a6cb-d17551ddcc22	true	display.on.consent.screen
8e950914-3ed6-4aee-b800-ed853daa0561	true	include.in.token.scope
8e950914-3ed6-4aee-b800-ed853daa0561	${phoneScopeConsentText}	consent.screen.text
8e950914-3ed6-4aee-b800-ed853daa0561	true	display.on.consent.screen
9d9017a4-e7c9-44c6-b662-5b41132c2077	false	display.on.consent.screen
052b5c14-ef41-4946-bfab-f5f4357b75d8	false	include.in.token.scope
052b5c14-ef41-4946-bfab-f5f4357b75d8	${rolesScopeConsentText}	consent.screen.text
052b5c14-ef41-4946-bfab-f5f4357b75d8	true	display.on.consent.screen
be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	false	include.in.token.scope
be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	false	display.on.consent.screen
4e7432a4-8c41-4eab-8d1e-156d4ee293b8	false	include.in.token.scope
4e7432a4-8c41-4eab-8d1e-156d4ee293b8	false	display.on.consent.screen
9904ff66-6dcd-464e-9c27-3211a5dce67e	true	include.in.token.scope
9904ff66-6dcd-464e-9c27-3211a5dce67e	${emailScopeConsentText}	consent.screen.text
9904ff66-6dcd-464e-9c27-3211a5dce67e	true	display.on.consent.screen
2b676baf-8495-4862-9fde-f1d15341bcca	true	include.in.token.scope
2b676baf-8495-4862-9fde-f1d15341bcca	${organizationScopeConsentText}	consent.screen.text
2b676baf-8495-4862-9fde-f1d15341bcca	true	display.on.consent.screen
0a4492f4-3fd9-451f-9e86-fcb9f299c013	${samlRoleListScopeConsentText}	consent.screen.text
0a4492f4-3fd9-451f-9e86-fcb9f299c013	true	display.on.consent.screen
2ec129e2-621c-448c-aec1-fd4bece19fdd	true	include.in.token.scope
2ec129e2-621c-448c-aec1-fd4bece19fdd	false	display.on.consent.screen
dbd4f101-fe82-4a49-8c4b-a1d5aac1808a	false	include.in.token.scope
dbd4f101-fe82-4a49-8c4b-a1d5aac1808a	false	display.on.consent.screen
8be62890-c805-4ed1-b779-90794f6b92b1	false	include.in.token.scope
8be62890-c805-4ed1-b779-90794f6b92b1		consent.screen.text
8be62890-c805-4ed1-b779-90794f6b92b1	false	display.on.consent.screen
bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	true	include.in.token.scope
bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	${profileScopeConsentText}	consent.screen.text
bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	true	display.on.consent.screen
5333a2c5-4889-427e-987c-72d11fd63a32	true	include.in.token.scope
5333a2c5-4889-427e-987c-72d11fd63a32	${addressScopeConsentText}	consent.screen.text
5333a2c5-4889-427e-987c-72d11fd63a32	true	display.on.consent.screen
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
b6749730-19c5-4539-b648-70b3d768d4a5	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
b6749730-19c5-4539-b648-70b3d768d4a5	9b6fac52-921d-4651-9576-2e6309ebad4d	t
b6749730-19c5-4539-b648-70b3d768d4a5	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
b6749730-19c5-4539-b648-70b3d768d4a5	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
b6749730-19c5-4539-b648-70b3d768d4a5	055566ba-981c-4e8f-b24d-aeaf28648839	t
b6749730-19c5-4539-b648-70b3d768d4a5	313805c4-3f97-481d-8249-f8e26cf713bd	t
b6749730-19c5-4539-b648-70b3d768d4a5	dfca62de-1771-4178-9cfc-c554fd823903	f
b6749730-19c5-4539-b648-70b3d768d4a5	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
b6749730-19c5-4539-b648-70b3d768d4a5	18d7c917-5c3e-405d-9c2e-9a6654757652	f
b6749730-19c5-4539-b648-70b3d768d4a5	3abac829-4fda-4af1-987d-762dd251cbfe	f
b6749730-19c5-4539-b648-70b3d768d4a5	183350b2-cd79-4910-b9ba-12e0d22bd938	f
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	9b6fac52-921d-4651-9576-2e6309ebad4d	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	055566ba-981c-4e8f-b24d-aeaf28648839	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	313805c4-3f97-481d-8249-f8e26cf713bd	t
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	dfca62de-1771-4178-9cfc-c554fd823903	f
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	18d7c917-5c3e-405d-9c2e-9a6654757652	f
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	3abac829-4fda-4af1-987d-762dd251cbfe	f
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	183350b2-cd79-4910-b9ba-12e0d22bd938	f
fc7ed42f-c156-4907-b0fb-cd723299c867	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
fc7ed42f-c156-4907-b0fb-cd723299c867	9b6fac52-921d-4651-9576-2e6309ebad4d	t
fc7ed42f-c156-4907-b0fb-cd723299c867	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
fc7ed42f-c156-4907-b0fb-cd723299c867	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
fc7ed42f-c156-4907-b0fb-cd723299c867	055566ba-981c-4e8f-b24d-aeaf28648839	t
fc7ed42f-c156-4907-b0fb-cd723299c867	313805c4-3f97-481d-8249-f8e26cf713bd	t
fc7ed42f-c156-4907-b0fb-cd723299c867	dfca62de-1771-4178-9cfc-c554fd823903	f
fc7ed42f-c156-4907-b0fb-cd723299c867	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
fc7ed42f-c156-4907-b0fb-cd723299c867	18d7c917-5c3e-405d-9c2e-9a6654757652	f
fc7ed42f-c156-4907-b0fb-cd723299c867	3abac829-4fda-4af1-987d-762dd251cbfe	f
fc7ed42f-c156-4907-b0fb-cd723299c867	183350b2-cd79-4910-b9ba-12e0d22bd938	f
43c32d49-0d14-470e-b663-988f6201d387	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
43c32d49-0d14-470e-b663-988f6201d387	9b6fac52-921d-4651-9576-2e6309ebad4d	t
43c32d49-0d14-470e-b663-988f6201d387	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
43c32d49-0d14-470e-b663-988f6201d387	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
43c32d49-0d14-470e-b663-988f6201d387	055566ba-981c-4e8f-b24d-aeaf28648839	t
43c32d49-0d14-470e-b663-988f6201d387	313805c4-3f97-481d-8249-f8e26cf713bd	t
43c32d49-0d14-470e-b663-988f6201d387	dfca62de-1771-4178-9cfc-c554fd823903	f
43c32d49-0d14-470e-b663-988f6201d387	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
43c32d49-0d14-470e-b663-988f6201d387	18d7c917-5c3e-405d-9c2e-9a6654757652	f
43c32d49-0d14-470e-b663-988f6201d387	3abac829-4fda-4af1-987d-762dd251cbfe	f
43c32d49-0d14-470e-b663-988f6201d387	183350b2-cd79-4910-b9ba-12e0d22bd938	f
11977ab8-d817-442b-abe2-b1d5bdd95ce8	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	9b6fac52-921d-4651-9576-2e6309ebad4d	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	055566ba-981c-4e8f-b24d-aeaf28648839	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	313805c4-3f97-481d-8249-f8e26cf713bd	t
11977ab8-d817-442b-abe2-b1d5bdd95ce8	dfca62de-1771-4178-9cfc-c554fd823903	f
11977ab8-d817-442b-abe2-b1d5bdd95ce8	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
11977ab8-d817-442b-abe2-b1d5bdd95ce8	18d7c917-5c3e-405d-9c2e-9a6654757652	f
11977ab8-d817-442b-abe2-b1d5bdd95ce8	3abac829-4fda-4af1-987d-762dd251cbfe	f
11977ab8-d817-442b-abe2-b1d5bdd95ce8	183350b2-cd79-4910-b9ba-12e0d22bd938	f
13d7c309-40a4-4da8-96e4-d38563094724	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
13d7c309-40a4-4da8-96e4-d38563094724	9b6fac52-921d-4651-9576-2e6309ebad4d	t
13d7c309-40a4-4da8-96e4-d38563094724	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
13d7c309-40a4-4da8-96e4-d38563094724	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
13d7c309-40a4-4da8-96e4-d38563094724	055566ba-981c-4e8f-b24d-aeaf28648839	t
13d7c309-40a4-4da8-96e4-d38563094724	313805c4-3f97-481d-8249-f8e26cf713bd	t
13d7c309-40a4-4da8-96e4-d38563094724	dfca62de-1771-4178-9cfc-c554fd823903	f
13d7c309-40a4-4da8-96e4-d38563094724	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
13d7c309-40a4-4da8-96e4-d38563094724	18d7c917-5c3e-405d-9c2e-9a6654757652	f
13d7c309-40a4-4da8-96e4-d38563094724	3abac829-4fda-4af1-987d-762dd251cbfe	f
13d7c309-40a4-4da8-96e4-d38563094724	183350b2-cd79-4910-b9ba-12e0d22bd938	f
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	8be62890-c805-4ed1-b779-90794f6b92b1	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	8e950914-3ed6-4aee-b800-ed853daa0561	f
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	2b676baf-8495-4862-9fde-f1d15341bcca	f
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	5333a2c5-4889-427e-987c-72d11fd63a32	f
af6f50f5-ba18-410b-9f03-544a93928f96	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
af6f50f5-ba18-410b-9f03-544a93928f96	8be62890-c805-4ed1-b779-90794f6b92b1	t
af6f50f5-ba18-410b-9f03-544a93928f96	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
af6f50f5-ba18-410b-9f03-544a93928f96	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
af6f50f5-ba18-410b-9f03-544a93928f96	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
af6f50f5-ba18-410b-9f03-544a93928f96	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
af6f50f5-ba18-410b-9f03-544a93928f96	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
af6f50f5-ba18-410b-9f03-544a93928f96	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
af6f50f5-ba18-410b-9f03-544a93928f96	8e950914-3ed6-4aee-b800-ed853daa0561	f
af6f50f5-ba18-410b-9f03-544a93928f96	2b676baf-8495-4862-9fde-f1d15341bcca	f
af6f50f5-ba18-410b-9f03-544a93928f96	5333a2c5-4889-427e-987c-72d11fd63a32	f
da9095a0-e66c-4fc1-90b9-e550827c1ee6	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	8be62890-c805-4ed1-b779-90794f6b92b1	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
da9095a0-e66c-4fc1-90b9-e550827c1ee6	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
da9095a0-e66c-4fc1-90b9-e550827c1ee6	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
da9095a0-e66c-4fc1-90b9-e550827c1ee6	8e950914-3ed6-4aee-b800-ed853daa0561	f
da9095a0-e66c-4fc1-90b9-e550827c1ee6	2b676baf-8495-4862-9fde-f1d15341bcca	f
da9095a0-e66c-4fc1-90b9-e550827c1ee6	5333a2c5-4889-427e-987c-72d11fd63a32	f
b78d4c63-f8da-4b2f-9461-a549243d1209	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
b78d4c63-f8da-4b2f-9461-a549243d1209	8be62890-c805-4ed1-b779-90794f6b92b1	t
b78d4c63-f8da-4b2f-9461-a549243d1209	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
b78d4c63-f8da-4b2f-9461-a549243d1209	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
b78d4c63-f8da-4b2f-9461-a549243d1209	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
b78d4c63-f8da-4b2f-9461-a549243d1209	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
b78d4c63-f8da-4b2f-9461-a549243d1209	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
b78d4c63-f8da-4b2f-9461-a549243d1209	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
b78d4c63-f8da-4b2f-9461-a549243d1209	8e950914-3ed6-4aee-b800-ed853daa0561	f
b78d4c63-f8da-4b2f-9461-a549243d1209	2b676baf-8495-4862-9fde-f1d15341bcca	f
b78d4c63-f8da-4b2f-9461-a549243d1209	5333a2c5-4889-427e-987c-72d11fd63a32	f
160feab5-0797-49fb-a051-5a83bc344af9	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
160feab5-0797-49fb-a051-5a83bc344af9	8be62890-c805-4ed1-b779-90794f6b92b1	t
160feab5-0797-49fb-a051-5a83bc344af9	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
160feab5-0797-49fb-a051-5a83bc344af9	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
160feab5-0797-49fb-a051-5a83bc344af9	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
160feab5-0797-49fb-a051-5a83bc344af9	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
160feab5-0797-49fb-a051-5a83bc344af9	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
160feab5-0797-49fb-a051-5a83bc344af9	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
160feab5-0797-49fb-a051-5a83bc344af9	8e950914-3ed6-4aee-b800-ed853daa0561	f
160feab5-0797-49fb-a051-5a83bc344af9	2b676baf-8495-4862-9fde-f1d15341bcca	f
160feab5-0797-49fb-a051-5a83bc344af9	5333a2c5-4889-427e-987c-72d11fd63a32	f
ac96be9b-608d-46f9-9c11-35c6b36e70c7	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	8be62890-c805-4ed1-b779-90794f6b92b1	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
ac96be9b-608d-46f9-9c11-35c6b36e70c7	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
ac96be9b-608d-46f9-9c11-35c6b36e70c7	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
ac96be9b-608d-46f9-9c11-35c6b36e70c7	8e950914-3ed6-4aee-b800-ed853daa0561	f
ac96be9b-608d-46f9-9c11-35c6b36e70c7	2b676baf-8495-4862-9fde-f1d15341bcca	f
ac96be9b-608d-46f9-9c11-35c6b36e70c7	5333a2c5-4889-427e-987c-72d11fd63a32	f
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	8be62890-c805-4ed1-b779-90794f6b92b1	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	8e950914-3ed6-4aee-b800-ed853daa0561	f
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	2b676baf-8495-4862-9fde-f1d15341bcca	f
d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	5333a2c5-4889-427e-987c-72d11fd63a32	f
519682a7-2e80-40dd-b373-d40041557f9c	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
519682a7-2e80-40dd-b373-d40041557f9c	8be62890-c805-4ed1-b779-90794f6b92b1	t
519682a7-2e80-40dd-b373-d40041557f9c	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
519682a7-2e80-40dd-b373-d40041557f9c	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
519682a7-2e80-40dd-b373-d40041557f9c	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
519682a7-2e80-40dd-b373-d40041557f9c	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
519682a7-2e80-40dd-b373-d40041557f9c	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
519682a7-2e80-40dd-b373-d40041557f9c	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
519682a7-2e80-40dd-b373-d40041557f9c	8e950914-3ed6-4aee-b800-ed853daa0561	f
519682a7-2e80-40dd-b373-d40041557f9c	2b676baf-8495-4862-9fde-f1d15341bcca	f
519682a7-2e80-40dd-b373-d40041557f9c	5333a2c5-4889-427e-987c-72d11fd63a32	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
18d7c917-5c3e-405d-9c2e-9a6654757652	a64136f4-6439-4c37-9482-bbe056e823f1
c45e8afc-e232-42b8-a6cb-d17551ddcc22	e896a114-c30a-4c85-a6bd-f5a2a66ea5b9
\.


--
-- Data for Name: cluster_event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cluster_event (id, target_cluster, sender_cluster, event_data, created_at) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
28c229a8-1f22-4625-8f00-02f1c2df872e	Max Clients Limit	aaddfc62-6c65-40bc-b197-99e305da29de	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
44492900-fc3a-430c-8be4-fd463ce88f35	Allowed Registration Web Origins	aaddfc62-6c65-40bc-b197-99e305da29de	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
8e169d02-a54b-4d64-a7ea-ddecfbe12bef	Trusted Hosts	aaddfc62-6c65-40bc-b197-99e305da29de	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
7391aa48-bfdb-42f8-8e61-7af6d56d2d89	Allowed Protocol Mapper Types	aaddfc62-6c65-40bc-b197-99e305da29de	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	authenticated
4d3bf347-46d8-4668-a43e-e690f86e9a6b	Allowed Client Scopes	aaddfc62-6c65-40bc-b197-99e305da29de	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	authenticated
700db426-660a-404d-8c3d-aad9345d2ca3	Allowed Protocol Mapper Types	aaddfc62-6c65-40bc-b197-99e305da29de	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
5cd9649f-dc83-4e27-87f4-a92d94ab8071	Allowed Client Scopes	aaddfc62-6c65-40bc-b197-99e305da29de	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
0068c517-f3e6-49cf-9a0c-2ffa40900e74	Consent Required	aaddfc62-6c65-40bc-b197-99e305da29de	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
74f5c9a0-f9a2-4868-a890-5e81460983d8	Full Scope Disabled	aaddfc62-6c65-40bc-b197-99e305da29de	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	anonymous
19d9b251-c0a4-49ae-9f28-30eaa754e9a9	Allowed Registration Web Origins	aaddfc62-6c65-40bc-b197-99e305da29de	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	authenticated
d4a3195b-820b-4704-8351-c2290861f301	\N	aaddfc62-6c65-40bc-b197-99e305da29de	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	aaddfc62-6c65-40bc-b197-99e305da29de	\N
33bcd9ea-dbbc-4886-b4fd-e624e2bcb943	aes-generated	aaddfc62-6c65-40bc-b197-99e305da29de	aes-generated	org.keycloak.keys.KeyProvider	aaddfc62-6c65-40bc-b197-99e305da29de	\N
349e66c5-7516-4367-a69e-1a8f684ba743	rsa-generated	aaddfc62-6c65-40bc-b197-99e305da29de	rsa-generated	org.keycloak.keys.KeyProvider	aaddfc62-6c65-40bc-b197-99e305da29de	\N
86b47d90-5c94-4879-b3ac-728cf9a3afe9	rsa-enc-generated	aaddfc62-6c65-40bc-b197-99e305da29de	rsa-enc-generated	org.keycloak.keys.KeyProvider	aaddfc62-6c65-40bc-b197-99e305da29de	\N
d09a22af-27ed-4150-95c8-17378d16153b	hmac-generated-hs512	aaddfc62-6c65-40bc-b197-99e305da29de	hmac-generated	org.keycloak.keys.KeyProvider	aaddfc62-6c65-40bc-b197-99e305da29de	\N
92a5509c-b603-4d92-8277-ec7378ff995e	Allowed Protocol Mapper Types	0b379a43-608e-4ff3-aaf5-6106d6df4979	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	authenticated
e55975fc-3f34-4eca-a870-27952cbb37ad	Allowed Registration Web Origins	0b379a43-608e-4ff3-aaf5-6106d6df4979	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
550120b1-30a7-49c0-9147-dd70fc7a36d2	Consent Required	0b379a43-608e-4ff3-aaf5-6106d6df4979	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
ad30622d-f1e4-4bbf-89de-42d463d9ec21	Allowed Registration Web Origins	0b379a43-608e-4ff3-aaf5-6106d6df4979	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	authenticated
86880960-d216-4ab6-a01f-58f7da8423e4	Trusted Hosts	0b379a43-608e-4ff3-aaf5-6106d6df4979	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
d95a2e4f-a07c-4fa6-9dc6-dd9374795822	Allowed Protocol Mapper Types	0b379a43-608e-4ff3-aaf5-6106d6df4979	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
7310f7bb-d808-46d6-b729-268c1b1cc546	Full Scope Disabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
6b7c6b8d-42fd-4e65-aee3-d97e16fbd517	Allowed Client Scopes	0b379a43-608e-4ff3-aaf5-6106d6df4979	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
f54598de-6011-445e-8e57-dc249f19911e	Allowed Client Scopes	0b379a43-608e-4ff3-aaf5-6106d6df4979	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	authenticated
09d9a87b-26bd-4173-8aba-85c7c6fadfc3	Max Clients Limit	0b379a43-608e-4ff3-aaf5-6106d6df4979	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	anonymous
2d33f700-ffca-41f8-ae80-3b3d23576886	rsa-generated	0b379a43-608e-4ff3-aaf5-6106d6df4979	rsa-generated	org.keycloak.keys.KeyProvider	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N
953d7e0e-0a40-4612-b4d3-7913080b409c	hmac-generated-hs512	0b379a43-608e-4ff3-aaf5-6106d6df4979	hmac-generated	org.keycloak.keys.KeyProvider	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N
6649d0f3-ca15-43c0-834f-1b5170118689	aes-generated	0b379a43-608e-4ff3-aaf5-6106d6df4979	aes-generated	org.keycloak.keys.KeyProvider	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N
33e8927d-d964-4516-982e-aea045fc0d4c	rsa-enc-generated	0b379a43-608e-4ff3-aaf5-6106d6df4979	rsa-enc-generated	org.keycloak.keys.KeyProvider	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
35458610-be0a-4a9a-b27d-e99c0196095a	28c229a8-1f22-4625-8f00-02f1c2df872e	max-clients	200
b1e6492b-55e4-43dd-96e1-258923aca1f1	8e169d02-a54b-4d64-a7ea-ddecfbe12bef	host-sending-registration-request-must-match	true
6fcd556a-6b9c-4a08-9e5b-4906da32390b	8e169d02-a54b-4d64-a7ea-ddecfbe12bef	client-uris-must-match	true
4a8efa35-fef9-4e7e-8524-0741120a67f9	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	saml-user-attribute-mapper
d58774c1-706a-4982-bf04-b3374eadef54	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
b3a2d3f0-7527-47a2-8980-aad77e2df416	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	oidc-address-mapper
cebbb2f6-4b0a-442c-842b-5f95c5d69aa4	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
e4f2694d-0215-4b57-adb3-b5c15b820734	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	oidc-full-name-mapper
ba7e1f13-3256-48ef-99c9-9364dca3d1e4	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	saml-role-list-mapper
9101b563-4127-4221-96d3-2c7ed9fbaf93	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
4471be7f-9559-4094-bf83-b3a0a625c140	7391aa48-bfdb-42f8-8e61-7af6d56d2d89	allowed-protocol-mapper-types	saml-user-property-mapper
72262f95-f1ff-4861-8a5d-8ae149d23a21	4d3bf347-46d8-4668-a43e-e690f86e9a6b	allow-default-scopes	true
be961769-ed0c-4202-9215-e248f5cdebe1	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	oidc-full-name-mapper
8a077958-a6fd-4705-8b7a-507dc2903105	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	oidc-address-mapper
8d438805-327e-409f-b593-125ee17336c0	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	saml-user-attribute-mapper
3417ee48-bc1c-43bb-bf72-8065ecb5e065	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
ea7c1411-9537-430e-a901-376a622cf6b8	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	saml-role-list-mapper
9898fa43-6654-49c8-8c96-932063baf13b	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
0ff4d8dd-d73a-4489-a396-3a1c118b8b43	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
6df0c7a7-82ce-439d-b84b-0e1f221015d6	700db426-660a-404d-8c3d-aad9345d2ca3	allowed-protocol-mapper-types	saml-user-property-mapper
be434140-cf39-4919-af35-a7ac4872be5e	5cd9649f-dc83-4e27-87f4-a92d94ab8071	allow-default-scopes	true
94b2216a-310a-4ec5-88a6-3db121a3ff31	33bcd9ea-dbbc-4886-b4fd-e624e2bcb943	kid	631690dc-7f6f-4a44-b0aa-aa9ec4d3e37a
b1dcaebb-bc62-4b4b-824e-d872a05ce78a	33bcd9ea-dbbc-4886-b4fd-e624e2bcb943	secret	UMLJf6vwx7dZJ9MFJXSCR-DSxX_QRkpkberKjnpcNSQ
cc2e7067-3e5c-432b-a1c5-53087f800e44	33bcd9ea-dbbc-4886-b4fd-e624e2bcb943	priority	100
e92c7516-1bec-45f8-89c1-746097808a7c	349e66c5-7516-4367-a69e-1a8f684ba743	certificate	MIICmzCCAYMCBgGgQucpkzANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwODI3MTEwNTQwWhcNMzYwODI3MTEwNzIwWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC5ys+dscU/jg9kMmSJV7ARgeJtjYyGkpJ8bAU2R/OvMaJDAEaf4PzZz7+HG7ZRxhhQ717+8TW/qsREy5p9TykZKHHd3Gk40oke5ZesjK2qSjBBAaR6fgjnRLP+qkYBKqU4dS0zDN67oniEUegmFRNA7MaX3OMlponUglpuVC/TAhxyc+mZb5ybvOvMu18wxsY0A0vJ4gxe7bxV8DPjZWIqpIeqlmjJP7hMeJ7I9HWsD3+vwhjglrmODrxkHMKeIZpvyr+tQ6ELvipMXlbefQEhc5Czo6kDAykOqAV+Ezp5NBmbI154FCIPajy8iKCZZmRSATY4Y5/R04mUzfNo0YUDAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAC5lmYPIazngyg7J1jCHDRVq1/L7ZY9lThYMi8BiOcgDhKdxl2aEEHj5nnmTq1Gr4JmhdSyHI/Njfx9WgdHbj4Ko//S4u5XwTlxLI3IzWdnnj9FNL+w8zoRfbRe7J5vjmGcY5rMxN77nFcjh3PyAlKhk73xD9aERPu5LczJSyE1g/hwfO6gaaLXsRtDTS0e0qKVno4uQwp3a+nayr2lFmcjtTeJ3PPNzAvlKiY1h4bgpsNbtwFJeROXIBvCJXcXZuE2HAMfmPkU6iHKl/Fi4Y4nRdr2OkxSrdZ4yMackUEwnE0t/J68EAsmsAnBnr4laqoBuqh4nQqNtbE3wleUYgJA=
15fc09a9-457b-446c-afc4-d713b68456b1	349e66c5-7516-4367-a69e-1a8f684ba743	privateKey	MIIEpAIBAAKCAQEAucrPnbHFP44PZDJkiVewEYHibY2MhpKSfGwFNkfzrzGiQwBGn+D82c+/hxu2UcYYUO9e/vE1v6rERMuafU8pGShx3dxpONKJHuWXrIytqkowQQGken4I50Sz/qpGASqlOHUtMwzeu6J4hFHoJhUTQOzGl9zjJaaJ1IJablQv0wIccnPpmW+cm7zrzLtfMMbGNANLyeIMXu28VfAz42ViKqSHqpZoyT+4THieyPR1rA9/r8IY4Ja5jg68ZBzCniGab8q/rUOhC74qTF5W3n0BIXOQs6OpAwMpDqgFfhM6eTQZmyNeeBQiD2o8vIigmWZkUgE2OGOf0dOJlM3zaNGFAwIDAQABAoIBABl0avuNBpxNh1hP+yxCAlJzvCUMVqt9W2qGljQ4qW9gWn3ZhNOUzK++4dvN9S3A+UXlddtyCs4mxFs0lgcDGHtk6izebOAnIDhGdoBiicyh+3h8lB9gMzIUXKDQjWTNhfN1QmsTIVUNzns6iZbmHkwv5Imb7tcSuSGPdnpVOHQtQxvZ9DOszSdi9aQFKuQVNBBcVibFPUVYpsz1SP4Cw+mjPCDD9/AzQiJnZwBC6fTqhRD6hemE5KwDaVBVhCMWZlMW4iyO8ZuyCiAW2sCTkHrSZ6wN8A2MgIgfU82pxqAyziwcW/FKwIrpqPriblOvQUFzhd/BNJac3lQ7ej0E6+kCgYEA2puYwq9gzpN/AmNZep3xpS4uryIy5GBPReT+3FeecVJUNPJY2ye3ptd/q7bTUDlzJCDIHHfr8G6LgcRkYwv+9WTWcLSq5QOvEzTd6mVKOL20Ye2TYMxr2qsyDSU/I14VOyKQOMxMi0T3ZGbLvL2iivI6nthT3rOLfhM5f7+b9jUCgYEA2ZJJD26MV+80uv8SCUKSS4uJGawthALl2ZW/ekrdUvffBvdN0B0e95trH9e2glASBd5rdnaOubOKCKbEa4c6lQjAyBoCE+meiLRQBEDon8dsqGq5v4vZ/baTBl/pRALuVTFsvcl34Iec9XUlLVs/36BcAg4s/zEdOR7v/LL0lVcCgYEAg/AY+JdktAjtRQG1RX4CFBGVd3oKgS9naOXWtCHlrLtluzbxTgPgob+6fGaxjt+9kHaAkD4IlmoBpOZlOCpLTMv5aLiB1AqvJcZokUlkzG4iamA67Ncz2Rwt7yUlwDDOW4x2wvD62atcLKqmGFnTukyL+MbTh7uRWxw7PdDlTmkCgYEAkzv5kSXgd4l7B6ihTf7s/Y6Z4vOvgYxse0hpYZrUF9eB6DbnQ5TRZgKZBd12tsz0xV/1HR+yCl1DZgNlHNdQf5aCz2c6TLtl+2D6XUaHpcjQ8U/4D3XWuWkaKdAyDUJmguSFkBGMvDdJspnp5L3BhdYBLarmLHPSMNuM0FdSSNUCgYA5BEquzgnzke/+cy4+e5Bi3XZZkYu3fPP/avhY998wbGremPhlbPX+0tMCorYN+xZBE/3Qff9LmFHJU/uTftjt4Vg/beFUeMmO6oyd1f+OCkQ+qJHurrUBlcFzVzNPBtpoMYveXMuxxIPKmxKMuP+XvxQ6BtNcAbVk9z7/83p1EA==
6c400b42-8589-427c-874a-9c585241d285	349e66c5-7516-4367-a69e-1a8f684ba743	keyUse	SIG
55fb1e14-c21f-463d-807d-6a526d903b15	349e66c5-7516-4367-a69e-1a8f684ba743	priority	100
9c60e37f-dda8-47ca-9a05-60ce877de9aa	86b47d90-5c94-4879-b3ac-728cf9a3afe9	algorithm	RSA-OAEP
babb1a26-745c-4320-9ac5-0e4471b1adb5	86b47d90-5c94-4879-b3ac-728cf9a3afe9	keyUse	ENC
d5d0d98a-5a82-4060-b99a-2e5acb30ac5c	86b47d90-5c94-4879-b3ac-728cf9a3afe9	privateKey	MIIEpAIBAAKCAQEApKjNhktBzP14MJATorycMAUfZK07DRoLjZ5ACAe8d8gIMpgus3IB+b8obujYGSl/rxoNg3vculjmlccwAnRvR/Ft11hE1sL2XcaH/lSvir1tqLBAMQrfzs1nbYvAq+l3B206KpNxDgJz0N4hpezUE70MdHVlo2ovRFldErvC2WFmYBPBeKwpR8tC0nJQD2a4VEkh7/+t6T+VmgGsVmePfeO/f45qg4tIzgbQqNpiwwV3BFK/43RQNtq0w4jqY2yc9+LK2RyNBw2aUy4Ws55pGvdBoXBW4qEOVNKcR9dSQn6glUKFDSp3sGUIzU/eRpsvNd5m1lxSUKvKWGV13n+NNQIDAQABAoIBABhlD+oFDU8fAGcFeXtDQUqV/7QtPBHxWWPWXbsy1jfS0XAZftXEHsnPCeEAqz9zGAErtXPU7ntHP4ZSN+ktMe1xNepRIAXHZbO3/Z7vEgDWlsAGuMPrTgQ4B0pCCb4OfT2C77quFHJUZ686sbaA81ynRgic+f1vdmhEaxci7TfCSrGkLRaThT2rmjQlhuW3Lv6NVvb26P9V1iMbes6j3aaMnQFoDrpp5fS82VTGV5yPBGNl9gVRXEWFdUytXvNNxNkrgHUSvB6fJFQyJjPWT3TaZQtJANBj/9lY6RTKOV7HNbqZBh8bfpIQXKAMlXUafx/eZtHFpP0xmbEE/QRQ1gECgYEA5TMuGk8Yc2+E3oGuwrjjyFNaiB26sE6AB/UUTg06iVdyyBR0PYzgD4U2+mGGAcp+Ayd5IepfrVXebKs4HOhNRooIo0UVLixC+Fqu2dFdrq+dB/5w0X7aMTl4KbG/uUIJUtnqUmyCv0UdxH2aTn1jLG91GrVeK0VxYA6LG/yCtQECgYEAt+muOco1ZBr8IrKCbVYj5V84ke4P/wIzCWurp0o51+gUMk5f+dPcy48by6L/1uUiMhT5UwHdFLQk5y71oDt+4jxu5QdVyniSUP30kaMvaUYdTzMFUaZAD8KFB8yK/0MR0yYDsG3brtVgbZpOXYBRdgzpwqpfmBeQqUKmeaVMFDUCgYEAmcVhm/MPA3uBWEsHNcsXv3H03jeb5ed0zGHn8om7iSNrdcMLTbQzKxaEES3W22LAcltMUK3O7RscNCoXZoWQOtAnBWs2z5iQgdFNWAO4Z5eYsiFKDbOercHR1Z9UcvVUDgr3w77bZXn4g7iFCz3iiJBqr7WY7U0UyI5ZVDhwdQECgYBHGsfLfAxsaap118Jpd1Zlhg0fDoWMuFL3H3O8OAxpF0dHs9mTg3/oC6pZbumvMeOorUc/+oZ5TLS/1P4ONzJ1UZwmXFGk+DzJp4X5ELhx4TPPvRAfY0F9Vl2MiF5tFoc7tYTTn4XB8KlZdsE5kTTtiUyPgMN40BOT/TrT6T6iyQKBgQCYmWH+C2DIpTAsLg155nmrQ4jWtsD9gH/xw3hdjfxRpvVlXbJuqoCYdYr1f6MOG+0aMkoBCw+9EeZsGpwXxfyEuagG0uqtVGbkGORVb3dYllrGWg+2YED2+OjXULxVkKy5pUlJEE4W9JXZysy+ac5NVEsAP+HwCPij6oRt7XZZdQ==
2c4bf522-53d6-47a8-bc54-9d4dd4dd620e	86b47d90-5c94-4879-b3ac-728cf9a3afe9	certificate	MIICmzCCAYMCBgGgQucqtTANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwODI3MTEwNTQxWhcNMzYwODI3MTEwNzIxWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCkqM2GS0HM/XgwkBOivJwwBR9krTsNGguNnkAIB7x3yAgymC6zcgH5vyhu6NgZKX+vGg2De9y6WOaVxzACdG9H8W3XWETWwvZdxof+VK+KvW2osEAxCt/OzWdti8Cr6XcHbToqk3EOAnPQ3iGl7NQTvQx0dWWjai9EWV0Su8LZYWZgE8F4rClHy0LSclAPZrhUSSHv/63pP5WaAaxWZ499479/jmqDi0jOBtCo2mLDBXcEUr/jdFA22rTDiOpjbJz34srZHI0HDZpTLhaznmka90GhcFbioQ5U0pxH11JCfqCVQoUNKnewZQjNT95Gmy813mbWXFJQq8pYZXXef401AgMBAAEwDQYJKoZIhvcNAQELBQADggEBADFlnndheDsv4a0sXXwxFQ+Jyhe14eU2U9TPs3WjleFnplq+jinHIhQTs/PwUMNEofTgLVFdK63GkN8JHxZYtbWrSyhH9Dntv5Mx8kiGsiETa0UTerAd2in7NT06eg90VQg3g5ul/YLSrfdFIavfFBNYrBE7dOHzzWnBIMUeHQ8BBC6qlJujttV8f5bePTHLue/mRCBIodcnRiZ1nEk/O8w1z3x316Q0o5TdYBHRY8vSoBXKkz/WtF54BAOOP8y4phEB6M3FcM4UcdLHs+arlojGvUDfYKPbt068jJtrMqfs1Y8RC+PLWj3yDazL2Gf5qUNKeJ8QcvwCZwcqEN+mkvo=
465158bd-9e61-4d61-a3c8-d2ed786aa71a	86b47d90-5c94-4879-b3ac-728cf9a3afe9	priority	100
66d88018-4615-491e-bf9d-100ddd962563	d09a22af-27ed-4150-95c8-17378d16153b	priority	100
64d3805e-5355-47b1-9e2c-db95522703f3	d09a22af-27ed-4150-95c8-17378d16153b	secret	bZVz8cre4xL1OJOapzMhCzri8GE1QwKQAC_IXbne-lV4hv7zJ85FAMFzsxpt3cESwEYGSsae-aDH_f3ZNMDq6tYBK0hAq_vyR1LQCJWZjYIfDHxTtfJhsOO5uVbZeLy3rL69igVONj1amd4XhXd0XrRF1Ydt-EkqX3Si7Tf0-B4
2a6e479a-9060-494e-b7e7-2c94cee3858d	d09a22af-27ed-4150-95c8-17378d16153b	algorithm	HS512
2be29a8b-3db9-4ace-88ec-e58d08827b99	d09a22af-27ed-4150-95c8-17378d16153b	kid	47eaee4e-5ea3-4a7e-aa0e-6ded43fac500
e130f49a-c518-43ef-af05-eb67e344c69e	d4a3195b-820b-4704-8351-c2290861f301	kc.user.profile.config	{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}
0d6a8d48-bbc2-48c1-a748-492fa8b35b22	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	oidc-address-mapper
198d63c6-45bf-421c-986d-611590991c0e	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
4a082ba5-cec6-47a1-8bff-1e3ef9fbeffd	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	oidc-full-name-mapper
287a42fc-e180-4dec-ab66-54abf5f4e1ce	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	saml-user-attribute-mapper
ae157dbd-58db-4e55-af8c-8c9ddec1ad88	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	saml-role-list-mapper
f61e3bdb-e944-40f1-a60b-102efa3dce2b	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
b165b9f1-d7ed-44a4-8b53-a75996018912	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
1784b099-60c1-4f00-8dbb-b274cbb7cdca	92a5509c-b603-4d92-8277-ec7378ff995e	allowed-protocol-mapper-types	saml-user-property-mapper
01be2869-600c-4ffc-a794-27c8f0e00e86	86880960-d216-4ab6-a01f-58f7da8423e4	client-uris-must-match	true
691e74cb-9cff-44dd-af0a-ad03ed9f9577	86880960-d216-4ab6-a01f-58f7da8423e4	host-sending-registration-request-must-match	true
0a77e177-e541-4441-9265-3fc4951d25eb	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	saml-user-attribute-mapper
d44aa9b0-7ce6-4dfd-8b45-28c9a0c1b5fe	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
3e5224a8-ed7d-4d2a-b7f8-51dc4128b01d	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	oidc-full-name-mapper
6e8ea6c5-ee6c-47d4-af70-8e22e6cfc279	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
809c99b2-c1a8-445d-a295-196667a9907e	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	saml-role-list-mapper
38fd773e-c226-4945-9959-257e65ba9652	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	saml-user-property-mapper
63dc170e-81c4-435f-80a6-630ace948497	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	oidc-address-mapper
82076683-981f-41b4-af0b-79ade66c5bf8	d95a2e4f-a07c-4fa6-9dc6-dd9374795822	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
55ceef87-a4d9-40ed-90ce-8e487bcc8309	6b7c6b8d-42fd-4e65-aee3-d97e16fbd517	allow-default-scopes	true
13c19a41-a0ef-4fcf-8ce4-ea01bd6dd981	2d33f700-ffca-41f8-ae80-3b3d23576886	priority	100
36e63afe-0caa-4a2a-8269-d7f5851650f3	2d33f700-ffca-41f8-ae80-3b3d23576886	privateKey	MIIEowIBAAKCAQEAt4kSbRoSzLrXSDKm6HzXJSe1+a1KG5/Gp6Nco7DEoL8NKgLKMXd0xYSc8le7CyFBFUKeuxWBlvvdCjn0hEUM5ibkLOxN4VSlnrTAxHYH9Gy3G3UvcujCkFsE4567gBFVTNaY4CWSJ3Vz1nCmyjd8dw0iZg5UkLSzGkvFKV0vHp2VjQLAeb1428Asb1Dfk1pc1B0BgjC7EubWAyBTVPXvksbpG3/n/3yxTkTI46nMAV27+Tr7iam9rkvAiS4n+t6xtMgF3ZCwgvQEHMBowJh1oW63VTnr4NQYtCKWdcVbNU8nMwaAfATCcmTViEEQQuYYX4b2kFQ+5d6IYoNzC65KcwIDAQABAoIBABX3jgEI8d8XLdUyWs/QwV9tFVbA6vHLeddushPVgHNM6qJwmwq4pX1OlgpbfcOjQ0rsIlt6A3yywI4MybtbGGQjm4PU9K1XmEsaj0f0aJdUu8XJjNhQC5mDi15DDWYSrQb5WGrblFastCSibxQc+AS3ybo1VOHM/vLSxtJgmNctCUicq5cCndpWdKpFc22dok0isIAj/EQVuLMBAnGohZXYh0+C7QNLeEOvjnSwkZxpVDPSSPOepsc7qvtJ1SDgg4wccbdgZvc5IhpQx8ByJZTrmSl1hG/a10dIRk4sQHJZalwShjYOlV5QNBAli7HmUp3GP41xEaJwotXtExPkDEECgYEA6KuUYKPg1+HAIXCkvszh0p5Z+SxdjzwkuhsPXmb78NsGgDQm27Eqsyz4K0Lo1gBcylhPUK3NlVbZXZQJgacnCZBddswwbyLzijswRM1LH746NYbR/+U6RXd8siwoGFE5Bov6Mi2DI5i1xGQm7irbga62uj/71+Or3rI5la5PE/sCgYEAyfA/5L3E+M15WjZYp2X2hOXV6IUydM/GQskSNwd3eVp5GBg6vo8OH5PLLNQXC8XmrySwxB9dczaZm8ds9VloZtlaT8JTpYQHe3c0bg9wIACrfyktovaIfakD9p1XVXlesBLZlGQFOrFLQKXxRw5yGDBUCxu3E/9h4PTT8wD5YekCgYBMHARXcIQWWlR9G9noSCD+wqnv5mFcf3IMJtnqKYn0idEgku67IsMzBVzQ2fxMNKYl0qlvXMtJNLW59Lj/XmxYpo7MU5LsZ+R+rUnm17jhU1q7M7TyHkvneWSi6+rZuYgL6jIXw+eH92ZOLezGL+LKExrW5iM9xc3s9SP9IJ3hjQKBgBol18Agqm6k/H+n5dbXJxKSSB5xkNT7Smq/anJhryCxjFiIWqLuFyATnQ1S8SD/IR2wnIronMscWMuJCRzD1PbsUftd6ELYU7ey+cD+ksAyFgLDLDubvJS42+CFAxf4PUCDUFUclmjBKENYuWNABZoIN/mwPwaB3QSp7v/aMnBxAoGBAKVpA812au0GgVaUr3CPQwllbnW5ZRoMetwiO+2kUvgPImJbj+aLMXwFvcIrkzK2oI6THZSKPkZA7NiNA35PyNjZcE99IcV3x5Gzhko4FVKN/czJFutd3zarxlLXL6BRxO6M0GhVrnZwh4UeOwxFEEKkjAFOClhGRnOVpjCh0VFp
3c3aadf2-ff13-4f61-9b22-7c5365a8b773	2d33f700-ffca-41f8-ae80-3b3d23576886	certificate	MIIClTCCAX0CBgGgbOxwxDANBgkqhkiG9w0BAQsFADAOMQwwCgYDVQQDDANyYWcwHhcNMjYwOTA0MTQ1NTI5WhcNMzYwOTA0MTQ1NzA5WjAOMQwwCgYDVQQDDANyYWcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC3iRJtGhLMutdIMqbofNclJ7X5rUobn8ano1yjsMSgvw0qAsoxd3TFhJzyV7sLIUEVQp67FYGW+90KOfSERQzmJuQs7E3hVKWetMDEdgf0bLcbdS9y6MKQWwTjnruAEVVM1pjgJZIndXPWcKbKN3x3DSJmDlSQtLMaS8UpXS8enZWNAsB5vXjbwCxvUN+TWlzUHQGCMLsS5tYDIFNU9e+Sxukbf+f/fLFORMjjqcwBXbv5OvuJqb2uS8CJLif63rG0yAXdkLCC9AQcwGjAmHWhbrdVOevg1Bi0IpZ1xVs1TyczBoB8BMJyZNWIQRBC5hhfhvaQVD7l3ohig3MLrkpzAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAExb1vv0DIvfhvsuXtWTl4PBhMPoNnq8JlSPEQ98lCZB+Tozf/xwduwSAeDWAQupeApTxYdXC4VE6Zm2HK34ymql5pv4hsn1f3lJzF15b7qErblA4Ni5gx80BW8HlWOBMwIljeXNyNlmZE4BLWcM+nFlyccZr60YxxVemAbstX1D925GMkO2qaID0mfA+tC5PoGNYvzwTm0ApgyKI7Ok0qvogbeQZYFz0qgbz6S3sk1WTs9vvU17dKMmRnpUYrU17IS1Q/UCwIo8RlCJ27Xy+7Sn7GtzJsRzj/PMrb+cggLVexEE+PMz0e+P8H8fp4uzysnZBomfVZyuPAwGpZDzqcs=
67bb7ae4-ee19-4110-9108-2200be854320	953d7e0e-0a40-4612-b4d3-7913080b409c	priority	100
993ba179-d707-42a2-aab6-620e581612cd	953d7e0e-0a40-4612-b4d3-7913080b409c	kid	a0ca63a3-4e45-4a57-b188-741bb68aea9f
c58f6ea7-8399-4e3a-8a12-02a92f2e294e	953d7e0e-0a40-4612-b4d3-7913080b409c	secret	R8qqZPtTo3SUbaHD6w46t5AKKHCZ5LMg7wYG5Mlj-9EVPmq33F_QPJuFNQaK0dUSj26sdxdXMUHu4MTljpgSTS3kY7CLRMFExxZCZqbq2NQXUxIpEqsNGoY_VzbCWo_8_LqV__cBH1YH1SC6dMWqwlX61rKmCgiaiUGm2OKyPGg
93cf3248-975f-4ad9-9b8a-c0f8b0e60551	953d7e0e-0a40-4612-b4d3-7913080b409c	algorithm	HS512
645c4aed-1729-4137-b9fb-984ad98f1b26	6649d0f3-ca15-43c0-834f-1b5170118689	kid	1abff3fd-66b9-4358-ac5e-f77a3901efa9
31df8460-e77e-473a-ac28-ea2d6e9bdc20	6649d0f3-ca15-43c0-834f-1b5170118689	priority	100
cd5bd3b9-7a21-4b68-834e-30efdd82dac0	6649d0f3-ca15-43c0-834f-1b5170118689	secret	Dh_9rR6Z__3KZcDpWTJx4QJ7oapRriBm2dUk9LpkcBY
ea1e7148-e3fa-4963-9433-4055c44af58c	33e8927d-d964-4516-982e-aea045fc0d4c	privateKey	MIIEpAIBAAKCAQEAqk1PRFIWod/NqzYT35JqVqrlFaF+0S8TFb9DrxUnV9FQsZ4jk6UmrCWLY6UFRL8YBFRIkh/QjbDcW1uhytMa+MHxN3wJDOVjOBxZeB0QGT4edohfVTQSM8mRvyBbuWwU59R1c8pC1jPo+aALiqd8gF5AO0eyhMqKODF+PVv56Z5w8P2mjhyGBKOiYRMpvFUKYvxC+fyOAtce30UC1bPyoz7NXZsdYRA1B5lW5xGHRsF2Icf1cTJvEvoYLxjC1OaRRGpJthfYFA0og310GNO18EImfjePj+ZpcJqKd1NW4oypf0yNyuOO7mIOdV1yafsPHFxwe82dw61O44rZ6PjEhQIDAQABAoIBAE6UnZ7IweivfBckPMdMqASVll8ExZ+AOS4vsut2t1CuJK3QaloWOmH0cPzpiCTQiCR3P4UtaO34TbVZ8q3D+w4Nb2BKu2JX9hBOBHqH7oW3RBctlc+a10tOFxI5vBky5fKS9h8XlP+BtF56mti/r5ML6ldwHc9oJZ8IN1fYuNgyouhhY1ulmvpcqTA47whV1B1TK/Cg+EuuWZJUAWTwCSlXXpOa07q//JGhi3YWGHuB0COdoB77WiUkx9xQSHUJDTstDFNDxAIEyS/vnlb+rDHGdij4wQtW9vprv5/asJZ6Sug1MzAvgacJSsPMOQlWUDdfJ7WLiCUr76JNoUsfHYECgYEA1mVoxh1r94Vw8pqF61/iHveosp4aOO0TTa2ESF02KeRq4rrF5HYOeWPQop4NsjoFrbXyz3/mMjb9PT7ejCB7CIZHtdmEmLTBqYXvTQB6nH0aXVJyI1fyhEg4CBYG7RTNYIPel0dEKuGgKfTqonFHJjt3S3uNKlVUw6pSRudlG8MCgYEAy1ltxJAJww04WG/Yj1ltiBuey6dbE/ZIyMps2n8dxDI5+oa3FyTP9gFCojSvMDGfyBq3lqpcR2uS0s1ZDku0Yw1JQLFdru8Rbb+UiJAcZBQuwxSeVBLoOhKwlClFOxBL3sS0+kLa1nMQktmmlLue1YdePo+qZGPhtrfBE76pQhcCgYEArbJrOFcN6fOKloLqjM+Z+0zauBuvUv9/7CbwTVB3WWldz2NSgM3E3EQp/BXhMswfXaVTmxkb/wLeGIie9Rg7laR05Lfd3XpUjGuefNwueipA+eqZ3liaeuGnw6VU5y87VT6BUD7E05kIkfWDQyhTZH45IEZxECMiEYQkNJ20JNECgYEAqQg8e3Ez/CQoGzNVs8slhkdXV3hU+CH4XJgPpgyWZLlPgpWq6h0alSZ1Cjp7CbemVwMGasJQFLoyAPLbPUvmtZOcuZ71/e0R8sWWpXINd49jU5v3BHH3Ahb5Gx+3QaKJPrMKsSETocFiHH+5vda78EknKR/pBqwUOvtCDrSlI58CgYBH2B/I+tv5SR5V8jcq3GXoomBt3JoBQhF9etbCk2PNb4yXMO4J8Vds8d0DNOJY8vsHTtdEiJ+mzSfddm3GpYIlgMN/Jvop3jXCIf7x5EfMO6RnWEk+hMTAzvqYYME5ZyyeKC5JFfmv+RvMMTw2IB6Qt31iUOF2iBfdGzJyvnQ8tw==
72583caf-12c4-40d9-b930-1b8061efdd1c	33e8927d-d964-4516-982e-aea045fc0d4c	certificate	MIIClTCCAX0CBgGgbOxyUzANBgkqhkiG9w0BAQsFADAOMQwwCgYDVQQDDANyYWcwHhcNMjYwOTA0MTQ1NTMwWhcNMzYwOTA0MTQ1NzEwWjAOMQwwCgYDVQQDDANyYWcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqTU9EUhah382rNhPfkmpWquUVoX7RLxMVv0OvFSdX0VCxniOTpSasJYtjpQVEvxgEVEiSH9CNsNxbW6HK0xr4wfE3fAkM5WM4HFl4HRAZPh52iF9VNBIzyZG/IFu5bBTn1HVzykLWM+j5oAuKp3yAXkA7R7KEyoo4MX49W/npnnDw/aaOHIYEo6JhEym8VQpi/EL5/I4C1x7fRQLVs/KjPs1dmx1hEDUHmVbnEYdGwXYhx/VxMm8S+hgvGMLU5pFEakm2F9gUDSiDfXQY07XwQiZ+N4+P5mlwmop3U1bijKl/TI3K447uYg51XXJp+w8cXHB7zZ3DrU7jitno+MSFAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAD9SBUkyBcFAKYKPpNGhxN+w0DsByGin4yoX34MAyaL4lO/BnhXSiUTRXiO0OTljNBmQsEThIX1Fn9mtu20tlpngBs1pmS8lGbx/IQJmCQ1WPLeck4Sb1k4jzAVsjYZgy97Ox9ugd6PntQOQOtMVUCvhX53uCYS1sNa3Ll61tT9Yw5LNhLW86+4TPrD4/boEhcEwx8jUVtCYXgNGl65WljqkSUEzHCSru5M62T0/yzuRNpfg0jXeyPDSP22BNPKLPjRdDx//X4/kARZXWFvxrEPMsJhnOWB0p+/9pcfpXlh/7N2Qr7Yh4932OefHY+GBWGkPRHRzY/bKOORPoP0NX9Q=
cbff64c4-9f5c-4c56-89c8-5e474955cbbf	33e8927d-d964-4516-982e-aea045fc0d4c	priority	100
1cef9604-02dc-4a70-a01b-714186f96feb	33e8927d-d964-4516-982e-aea045fc0d4c	algorithm	RSA-OAEP
4714d9b8-506a-4894-ac85-0964f1b5f0ba	f54598de-6011-445e-8e57-dc249f19911e	allow-default-scopes	true
1470ad36-588a-4411-89fa-fa09382af879	09d9a87b-26bd-4173-8aba-85c7c6fadfc3	max-clients	200
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.composite_role (composite, child_role) FROM stdin;
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	a64136f4-6439-4c37-9482-bbe056e823f1
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	6acbc5ea-0238-4d6c-be26-f2f93fe7e745
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	aee743f3-7bda-4e8b-952d-9bd67142dd36
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	8f407941-5ffb-4ef6-baba-99911fecc1cb
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	08b7ea03-0565-4efb-83de-6a406983d130
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	d77d6af6-2502-4633-8ad4-985504021d31
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	7190b6bb-a767-4e2e-a1bc-9f1e811203b3
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	fe8d186e-df26-4868-908b-e6f8ae333219
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	791cf557-34cd-4ffa-8178-7b360a3b42c9
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	36d88fe8-1a5e-41fc-8a48-48898c052592
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	6dec2d1e-5801-49f4-b0a8-1f0b717caf53
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	e5b568db-5d72-49d0-86b1-a10187eca0d6
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	ffb24f27-6bae-4e66-ae16-9e7a6af3e51c
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	5bef09b8-09b5-4fef-8b6c-4323006a89a0
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	830e9828-4803-4ccc-b19d-322f53d682f0
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	8f368a01-f660-413f-b909-2153952c0695
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	9df27f25-543c-480c-8b28-ac0e366f0d1b
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	4d3115e6-6fd0-4404-9a60-f4b162b750b4
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	fb7f660e-b1f8-4579-9d6c-a62b51c348a8
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	7be7fff1-035d-47dc-b9d0-b2acac8ed92d
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	85fdb387-ac9b-459b-9f38-92d42dc2d189
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	af42fc26-08d8-42b8-b465-0a759ee1e252
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	d6e0cb04-bf96-4a2b-8374-67d4f603ca45
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	ff331fc9-7a2b-4795-8dea-739a574be8df
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	51d32af5-cd8c-417b-ab1c-0e0012c5ec39
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	78970e21-8cd0-46ff-90c6-e68e15178236
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	78cb047a-e976-4f15-ae25-501ab512a856
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	610dafdf-d98d-4210-b025-f7698d1136e7
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	ec286fc7-e26d-4d39-93d0-56ae14b7f688
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	f6a3da52-cba5-4470-b03f-a9ae191eafcd
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	0dd98a06-d316-4dbf-8eba-7da30fcfa682
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	a3e91426-f833-44d1-b4f5-f8b7df13a6b6
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	f653c8d1-8fd8-4aee-8f1f-522965b77ba1
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	b500a851-aa8e-4a06-83a4-77de5dec5054
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	d7b862d1-5cc0-4945-96d1-bac1aea07f45
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	a6d6ac15-0f18-4888-95c9-5258b8d118de
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	947fc9a0-20d8-4211-88f2-4f2cf0d1f774
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	b613b23b-3ad2-40c6-9166-6813b3469060
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	c4c4b0a6-b881-4bc5-a53c-56060a4869da
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	5d15431c-4815-44b2-b781-c157104af853
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	923368af-15f9-4e1c-aa23-ae5a8de425d2
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	be13dc9d-d1e4-40dd-8474-b2f8953de823
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	deada3d6-c3e8-40e1-8b5b-9beb0ad2caa1
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	42532c9d-dd3a-4ebc-b6a3-b03916ca8c70
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	f2089b3d-889e-4c56-ab76-bc75d2bcb6b7
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	9a98ed26-ff60-4c50-b32a-fb7036c17848
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	5d97cecf-8893-42b0-be11-90c67b9f65bb
e5b568db-5d72-49d0-86b1-a10187eca0d6	85fdb387-ac9b-459b-9f38-92d42dc2d189
7190b6bb-a767-4e2e-a1bc-9f1e811203b3	ffb24f27-6bae-4e66-ae16-9e7a6af3e51c
7190b6bb-a767-4e2e-a1bc-9f1e811203b3	78970e21-8cd0-46ff-90c6-e68e15178236
af42fc26-08d8-42b8-b465-0a759ee1e252	9df27f25-543c-480c-8b28-ac0e366f0d1b
b613b23b-3ad2-40c6-9166-6813b3469060	b500a851-aa8e-4a06-83a4-77de5dec5054
42532c9d-dd3a-4ebc-b6a3-b03916ca8c70	be13dc9d-d1e4-40dd-8474-b2f8953de823
5d97cecf-8893-42b0-be11-90c67b9f65bb	c4c4b0a6-b881-4bc5-a53c-56060a4869da
5d97cecf-8893-42b0-be11-90c67b9f65bb	f6a3da52-cba5-4470-b03f-a9ae191eafcd
31b0f6ee-e360-472a-97c4-dfa65050394d	2edd655c-84d1-42ba-a213-c1fb3822b053
8f407941-5ffb-4ef6-baba-99911fecc1cb	340bcd37-fbf0-4fe6-8b7a-3671c30de814
9a4e149d-6038-4d4e-8187-5f862769e293	e896a114-c30a-4c85-a6bd-f5a2a66ea5b9
9a4e149d-6038-4d4e-8187-5f862769e293	f4b0afc2-b852-4e8f-a5e5-e0f9954dd54d
9a4e149d-6038-4d4e-8187-5f862769e293	db35a8da-587a-4a58-bd44-98f6275b766d
9a4e149d-6038-4d4e-8187-5f862769e293	244de787-3429-44d6-96a1-fe063194c79d
eeedb6c0-b45e-4046-ab39-78f815660c75	8f5c008f-4ba5-4b03-bb67-269697e1849d
dc86876a-1530-4ac3-88f6-74ce8900acbc	5e720be8-bc74-4b7e-b800-365aa42c7442
dc86876a-1530-4ac3-88f6-74ce8900acbc	d275339f-b328-4bc3-be13-3157df8ef82b
ca76a2c0-d873-4357-9dcb-1b709840e45c	570a9fc8-cc5b-4e7e-ab77-19c90f3617f0
c8ce35e3-dd07-4899-97d4-8e209a0424ed	f560c322-a615-4c0c-bb10-78fd6a371e14
c8ce35e3-dd07-4899-97d4-8e209a0424ed	6049af05-cbcd-49ba-a7cb-bf87748aa1fa
c8ce35e3-dd07-4899-97d4-8e209a0424ed	eeedb6c0-b45e-4046-ab39-78f815660c75
c8ce35e3-dd07-4899-97d4-8e209a0424ed	8fd3ceef-9b96-452d-8291-9d37f5823441
c8ce35e3-dd07-4899-97d4-8e209a0424ed	5caeaec3-8105-4ea5-bafc-fd556b9ddb76
c8ce35e3-dd07-4899-97d4-8e209a0424ed	292ef46e-938d-47d5-ac21-4ac99b1a1f9b
c8ce35e3-dd07-4899-97d4-8e209a0424ed	dc86876a-1530-4ac3-88f6-74ce8900acbc
c8ce35e3-dd07-4899-97d4-8e209a0424ed	9c634712-7d7c-4d05-a7ad-ed95621db73f
c8ce35e3-dd07-4899-97d4-8e209a0424ed	ca76a2c0-d873-4357-9dcb-1b709840e45c
c8ce35e3-dd07-4899-97d4-8e209a0424ed	3a684a29-6a48-4669-bfcb-5c9cdd356b4d
c8ce35e3-dd07-4899-97d4-8e209a0424ed	6e6cc2b2-cdb6-476a-8e78-51ef7137e8f5
c8ce35e3-dd07-4899-97d4-8e209a0424ed	6c611ff1-61bf-49b5-8842-b14ad42b1c42
c8ce35e3-dd07-4899-97d4-8e209a0424ed	5e720be8-bc74-4b7e-b800-365aa42c7442
c8ce35e3-dd07-4899-97d4-8e209a0424ed	d275339f-b328-4bc3-be13-3157df8ef82b
c8ce35e3-dd07-4899-97d4-8e209a0424ed	467235bb-b9cf-4873-b965-76d746bd714a
c8ce35e3-dd07-4899-97d4-8e209a0424ed	7bb968f8-735c-40d3-ba9c-eddbdfd80203
c8ce35e3-dd07-4899-97d4-8e209a0424ed	8f5c008f-4ba5-4b03-bb67-269697e1849d
c8ce35e3-dd07-4899-97d4-8e209a0424ed	ee8c3a1f-ea08-425b-be8f-adf1c8e55d5e
c8ce35e3-dd07-4899-97d4-8e209a0424ed	662a7116-59bc-463d-82ee-cd8fd279f53a
c8ce35e3-dd07-4899-97d4-8e209a0424ed	570a9fc8-cc5b-4e7e-ab77-19c90f3617f0
c8ce35e3-dd07-4899-97d4-8e209a0424ed	4b94ca5a-920f-4ff1-82ed-e183d3a3039b
db35a8da-587a-4a58-bd44-98f6275b766d	db7a9e52-4735-4db2-bdda-0ad58bbe8ee3
bef3e309-9fee-4914-8d6a-6b646cc19d86	a3f1fcac-88ce-48d6-8544-98bf156b54d7
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority, version) FROM stdin;
bbd59fc8-9431-4244-af23-5bd6f8659ac3	\N	password	aca176e6-cfd9-4170-8526-fbb9e338cf60	1787828841427	\N	{"value":"0kJPXj8V+UOFyMV1UPuDX6TOZQULhxkUM0I5oFZlT00=","salt":"BD8O5rkVfxXTdT+2p025zQ==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
b993ccf0-27c4-408c-95cf-7312a49bc8f6	\N	password	9aa1989a-4b86-40f0-93cb-e7785853b7ac	1788570878089	My password	{"value":"R6BffFM9dGrt1wM8vLHDphnGkClZddPl7Cow9XTLGvc=","salt":"Fz9A1RDGlXiv8Hrb6yC7PQ==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	1
b63425b2-2b66-474d-a852-9b985ff7ee65	\N	password	3f89d314-1121-4537-a949-f0146ef8fdcd	1788795427479	My password	{"value":"BuWSi+Z/PfCpzFZ3vNm0LYcx3RtFgCRgormDVYIoxaE=","salt":"G1fVMCLAJCHXvvZNrXfviw==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	1
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2026-09-04 14:57:01.426284	1	EXECUTED	9:6f1016664e21e16d26517a4418f5e3df	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.33.0	\N	\N	8533818227
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2026-09-04 14:57:01.436378	2	MARK_RAN	9:828775b1596a07d1200ba1d49e5e3941	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.33.0	\N	\N	8533818227
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2026-09-04 14:57:01.470979	3	EXECUTED	9:5f090e44a7d595883c1fb61f4b41fd38	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.33.0	\N	\N	8533818227
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2026-09-04 14:57:01.47359	4	EXECUTED	9:c07e577387a3d2c04d1adc9aaad8730e	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2026-09-04 14:57:01.527653	5	EXECUTED	9:b68ce996c655922dbcd2fe6b6ae72686	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.33.0	\N	\N	8533818227
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2026-09-04 14:57:01.532681	6	MARK_RAN	9:543b5c9989f024fe35c6f6c5a97de88e	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.33.0	\N	\N	8533818227
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2026-09-04 14:57:01.579899	7	EXECUTED	9:765afebbe21cf5bbca048e632df38336	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.33.0	\N	\N	8533818227
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2026-09-04 14:57:01.583926	8	MARK_RAN	9:db4a145ba11a6fdaefb397f6dbf829a1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.33.0	\N	\N	8533818227
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2026-09-04 14:57:01.588829	9	EXECUTED	9:9d05c7be10cdb873f8bcb41bc3a8ab23	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2026-09-04 14:57:01.625738	10	EXECUTED	9:18593702353128d53111f9b1ff0b82b8	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.33.0	\N	\N	8533818227
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2026-09-04 14:57:01.646849	11	EXECUTED	9:6122efe5f090e41a85c0f1c9e52cbb62	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	8533818227
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2026-09-04 14:57:01.649362	12	MARK_RAN	9:e1ff28bf7568451453f844c5d54bb0b5	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	8533818227
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2026-09-04 14:57:01.659314	13	EXECUTED	9:7af32cd8957fbc069f796b61217483fd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	8533818227
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-04 14:57:01.667354	14	EXECUTED	9:6005e15e84714cd83226bf7879f54190	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.33.0	\N	\N	8533818227
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-04 14:57:01.668479	15	MARK_RAN	9:bf656f5a2b055d07f314431cae76f06c	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-04 14:57:01.670142	16	MARK_RAN	9:f8dadc9284440469dcf71e25ca6ab99b	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.33.0	\N	\N	8533818227
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-04 14:57:01.671451	17	EXECUTED	9:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.33.0	\N	\N	8533818227
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2026-09-04 14:57:01.690505	18	EXECUTED	9:3368ff0be4c2855ee2dd9ca813b38d8e	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.33.0	\N	\N	8533818227
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2026-09-04 14:57:01.712393	19	EXECUTED	9:8ac2fb5dd030b24c0570a763ed75ed20	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.33.0	\N	\N	8533818227
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2026-09-04 14:57:01.718129	20	EXECUTED	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.33.0	\N	\N	8533818227
22.0.5-24031	keycloak	META-INF/jpa-changelog-22.0.0.xml	2026-09-04 14:57:04.194171	119	MARK_RAN	9:a60d2d7b315ec2d3eba9e2f145f9df28	customChange		\N	4.33.0	\N	\N	8533818227
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2026-09-04 14:57:01.720394	21	MARK_RAN	9:831e82914316dc8a57dc09d755f23c51	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.33.0	\N	\N	8533818227
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2026-09-04 14:57:01.722655	22	MARK_RAN	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.33.0	\N	\N	8533818227
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2026-09-04 14:57:01.774071	23	EXECUTED	9:bc3d0f9e823a69dc21e23e94c7a94bb1	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.33.0	\N	\N	8533818227
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2026-09-04 14:57:01.77729	24	EXECUTED	9:c9999da42f543575ab790e76439a2679	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.33.0	\N	\N	8533818227
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2026-09-04 14:57:01.777973	25	MARK_RAN	9:0d6c65c6f58732d81569e77b10ba301d	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.33.0	\N	\N	8533818227
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2026-09-04 14:57:02.00783	26	EXECUTED	9:fc576660fc016ae53d2d4778d84d86d0	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.33.0	\N	\N	8533818227
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2026-09-04 14:57:02.032792	27	EXECUTED	9:43ed6b0da89ff77206289e87eaa9c024	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.33.0	\N	\N	8533818227
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2026-09-04 14:57:02.035021	28	EXECUTED	9:44bae577f551b3738740281eceb4ea70	update tableName=RESOURCE_SERVER_POLICY		\N	4.33.0	\N	\N	8533818227
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2026-09-04 14:57:02.052697	29	EXECUTED	9:bd88e1f833df0420b01e114533aee5e8	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.33.0	\N	\N	8533818227
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2026-09-04 14:57:02.059072	30	EXECUTED	9:a7022af5267f019d020edfe316ef4371	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.33.0	\N	\N	8533818227
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2026-09-04 14:57:02.069432	31	EXECUTED	9:fc155c394040654d6a79227e56f5e25a	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.33.0	\N	\N	8533818227
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2026-09-04 14:57:02.071773	32	EXECUTED	9:eac4ffb2a14795e5dc7b426063e54d88	customChange		\N	4.33.0	\N	\N	8533818227
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-04 14:57:02.074519	33	EXECUTED	9:54937c05672568c4c64fc9524c1e9462	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-04 14:57:02.075513	34	MARK_RAN	9:f9753208029f582525ed12011a19d054	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.33.0	\N	\N	8533818227
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-04 14:57:02.085051	35	EXECUTED	9:33d72168746f81f98ae3a1e8e0ca3554	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.33.0	\N	\N	8533818227
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2026-09-04 14:57:02.087893	36	EXECUTED	9:61b6d3d7a4c0e0024b0c839da283da0c	addColumn tableName=REALM		\N	4.33.0	\N	\N	8533818227
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-04 14:57:02.089509	37	EXECUTED	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2026-09-04 14:57:02.090907	38	EXECUTED	9:a2b870802540cb3faa72098db5388af3	addColumn tableName=FED_USER_CONSENT		\N	4.33.0	\N	\N	8533818227
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2026-09-04 14:57:02.092396	39	EXECUTED	9:132a67499ba24bcc54fb5cbdcfe7e4c0	addColumn tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	8533818227
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-04 14:57:02.093024	40	MARK_RAN	9:938f894c032f5430f2b0fafb1a243462	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.33.0	\N	\N	8533818227
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-04 14:57:02.093896	41	MARK_RAN	9:845c332ff1874dc5d35974b0babf3006	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.33.0	\N	\N	8533818227
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2026-09-04 14:57:02.096029	42	EXECUTED	9:fc86359c079781adc577c5a217e4d04c	customChange		\N	4.33.0	\N	\N	8533818227
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-04 14:57:02.977984	43	EXECUTED	9:59a64800e3c0d09b825f8a3b444fa8f4	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.33.0	\N	\N	8533818227
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2026-09-04 14:57:02.980984	44	EXECUTED	9:d48d6da5c6ccf667807f633fe489ce88	addColumn tableName=USER_ENTITY		\N	4.33.0	\N	\N	8533818227
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-04 14:57:02.982923	45	EXECUTED	9:dde36f7973e80d71fceee683bc5d2951	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.33.0	\N	\N	8533818227
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-04 14:57:02.985399	46	EXECUTED	9:b855e9b0a406b34fa323235a0cf4f640	customChange		\N	4.33.0	\N	\N	8533818227
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-04 14:57:02.986195	47	MARK_RAN	9:51abbacd7b416c50c4421a8cabf7927e	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.33.0	\N	\N	8533818227
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-04 14:57:03.066562	48	EXECUTED	9:bdc99e567b3398bac83263d375aad143	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.33.0	\N	\N	8533818227
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-04 14:57:03.069423	49	EXECUTED	9:d198654156881c46bfba39abd7769e69	addColumn tableName=REALM		\N	4.33.0	\N	\N	8533818227
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2026-09-04 14:57:03.079234	50	EXECUTED	9:cfdd8736332ccdd72c5256ccb42335db	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.33.0	\N	\N	8533818227
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2026-09-04 14:57:03.294009	51	EXECUTED	9:7c84de3d9bd84d7f077607c1a4dcb714	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.33.0	\N	\N	8533818227
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2026-09-04 14:57:03.295889	52	EXECUTED	9:5a6bb36cbefb6a9d6928452c0852af2d	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2026-09-04 14:57:03.297365	53	EXECUTED	9:8f23e334dbc59f82e0a328373ca6ced0	update tableName=REALM		\N	4.33.0	\N	\N	8533818227
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2026-09-04 14:57:03.298521	54	EXECUTED	9:9156214268f09d970cdf0e1564d866af	update tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-04 14:57:03.301851	55	EXECUTED	9:db806613b1ed154826c02610b7dbdf74	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.33.0	\N	\N	8533818227
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-04 14:57:03.304182	56	EXECUTED	9:229a041fb72d5beac76bb94a5fa709de	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.33.0	\N	\N	8533818227
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-04 14:57:03.376702	57	EXECUTED	9:079899dade9c1e683f26b2aa9ca6ff04	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.33.0	\N	\N	8533818227
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-04 14:57:03.646342	58	EXECUTED	9:139b79bcbbfe903bb1c2d2a4dbf001d9	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.33.0	\N	\N	8533818227
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2026-09-04 14:57:03.656727	59	EXECUTED	9:b55738ad889860c625ba2bf483495a04	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.33.0	\N	\N	8533818227
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2026-09-04 14:57:03.660099	60	EXECUTED	9:e0057eac39aa8fc8e09ac6cfa4ae15fe	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.33.0	\N	\N	8533818227
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-09-04 14:57:03.663435	61	EXECUTED	9:42a33806f3a0443fe0e7feeec821326c	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.33.0	\N	\N	8533818227
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-09-04 14:57:03.665072	62	EXECUTED	9:9968206fca46eecc1f51db9c024bfe56	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.33.0	\N	\N	8533818227
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2026-09-04 14:57:03.666486	63	EXECUTED	9:92143a6daea0a3f3b8f598c97ce55c3d	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.33.0	\N	\N	8533818227
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2026-09-04 14:57:03.668082	64	EXECUTED	9:82bab26a27195d889fb0429003b18f40	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.33.0	\N	\N	8533818227
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2026-09-04 14:57:03.669489	65	EXECUTED	9:e590c88ddc0b38b0ae4249bbfcb5abc3	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.33.0	\N	\N	8533818227
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2026-09-04 14:57:03.692505	66	EXECUTED	9:5c1f475536118dbdc38d5d7977950cc0	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.33.0	\N	\N	8533818227
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2026-09-04 14:57:03.715382	67	EXECUTED	9:e7c9f5f9c4d67ccbbcc215440c718a17	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.33.0	\N	\N	8533818227
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2026-09-04 14:57:03.719383	68	EXECUTED	9:88e0bfdda924690d6f4e430c53447dd5	addColumn tableName=REALM		\N	4.33.0	\N	\N	8533818227
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2026-09-04 14:57:03.740099	69	EXECUTED	9:f53177f137e1c46b6a88c59ec1cb5218	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.33.0	\N	\N	8533818227
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2026-09-04 14:57:03.742446	70	EXECUTED	9:a74d33da4dc42a37ec27121580d1459f	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.33.0	\N	\N	8533818227
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2026-09-04 14:57:03.744107	71	EXECUTED	9:fd4ade7b90c3b67fae0bfcfcb42dfb5f	addColumn tableName=RESOURCE_SERVER		\N	4.33.0	\N	\N	8533818227
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-04 14:57:03.747411	72	EXECUTED	9:aa072ad090bbba210d8f18781b8cebf4	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-04 14:57:03.751064	73	EXECUTED	9:1ae6be29bab7c2aa376f6983b932be37	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-04 14:57:03.752048	74	MARK_RAN	9:14706f286953fc9a25286dbd8fb30d97	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-04 14:57:03.761342	75	EXECUTED	9:2b9cc12779be32c5b40e2e67711a218b	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.33.0	\N	\N	8533818227
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-04 14:57:03.787249	76	EXECUTED	9:91fa186ce7a5af127a2d7a91ee083cc5	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	8533818227
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-04 14:57:03.789136	77	EXECUTED	9:6335e5c94e83a2639ccd68dd24e2e5ad	addColumn tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-04 14:57:03.79024	78	MARK_RAN	9:6bdb5658951e028bfe16fa0a8228b530	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.33.0	\N	\N	8533818227
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-04 14:57:03.796893	79	EXECUTED	9:d5bc15a64117ccad481ce8792d4c608f	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.33.0	\N	\N	8533818227
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-04 14:57:03.797714	80	MARK_RAN	9:077cba51999515f4d3e7ad5619ab592c	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.33.0	\N	\N	8533818227
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-04 14:57:03.821851	81	EXECUTED	9:be969f08a163bf47c6b9e9ead8ac2afb	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-04 14:57:03.822797	82	MARK_RAN	9:6d3bb4408ba5a72f39bd8a0b301ec6e3	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-04 14:57:03.826458	83	EXECUTED	9:966bda61e46bebf3cc39518fbed52fa7	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-04 14:57:03.827159	84	MARK_RAN	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-04 14:57:03.84572	85	EXECUTED	9:7d93d602352a30c0c317e6a609b56599	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2026-09-04 14:57:03.848063	86	EXECUTED	9:71c5969e6cdd8d7b6f47cebc86d37627	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.33.0	\N	\N	8533818227
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-09-04 14:57:03.852101	87	EXECUTED	9:a9ba7d47f065f041b7da856a81762021	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.33.0	\N	\N	8533818227
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-09-04 14:57:03.854842	88	EXECUTED	9:fffabce2bc01e1a8f5110d5278500065	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.33.0	\N	\N	8533818227
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.861629	89	EXECUTED	9:fa8a5b5445e3857f4b010bafb5009957	addColumn tableName=REALM; customChange		\N	4.33.0	\N	\N	8533818227
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.867038	90	EXECUTED	9:67ac3241df9a8582d591c5ed87125f39	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.33.0	\N	\N	8533818227
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.884989	91	EXECUTED	9:ad1194d66c937e3ffc82386c050ba089	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.887988	92	EXECUTED	9:d9be619d94af5a2f5d07b9f003543b91	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.33.0	\N	\N	8533818227
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.88851	93	MARK_RAN	9:544d201116a0fcc5a5da0925fbbc3bde	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.33.0	\N	\N	8533818227
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.891348	94	EXECUTED	9:43c0c1055b6761b4b3e89de76d612ccf	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.33.0	\N	\N	8533818227
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.891974	95	MARK_RAN	9:8bd711fd0330f4fe980494ca43ab1139	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.33.0	\N	\N	8533818227
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-04 14:57:03.894666	96	EXECUTED	9:e07d2bc0970c348bb06fb63b1f82ddbf	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:03.952092	97	EXECUTED	9:24fb8611e97f29989bea412aa38d12b7	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:03.952988	98	MARK_RAN	9:259f89014ce2506ee84740cbf7163aa7	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:03.965536	99	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:03.986792	100	EXECUTED	9:60ca84a0f8c94ec8c3504a5a3bc88ee8	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:03.987849	101	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:04.009159	102	EXECUTED	9:0b305d8d1277f3a89a0a53a659ad274c	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-04 14:57:04.011562	103	EXECUTED	9:2c374ad2cdfe20e2905a84c8fac48460	customChange		\N	4.33.0	\N	\N	8533818227
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2026-09-04 14:57:04.014847	104	EXECUTED	9:47a760639ac597360a8219f5b768b4de	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.33.0	\N	\N	8533818227
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2026-09-04 14:57:04.031861	105	EXECUTED	9:a6272f0576727dd8cad2522335f5d99e	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.33.0	\N	\N	8533818227
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2026-09-04 14:57:04.052183	106	EXECUTED	9:015479dbd691d9cc8669282f4828c41d	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
18.0.15-30992-index-consent	keycloak	META-INF/jpa-changelog-18.0.15.xml	2026-09-04 14:57:04.078297	107	EXECUTED	9:80071ede7a05604b1f4906f3bf3b00f0	createIndex indexName=IDX_USCONSENT_SCOPE_ID, tableName=USER_CONSENT_CLIENT_SCOPE		\N	4.33.0	\N	\N	8533818227
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2026-09-04 14:57:04.080433	108	EXECUTED	9:9518e495fdd22f78ad6425cc30630221	customChange		\N	4.33.0	\N	\N	8533818227
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.104887	109	EXECUTED	9:e5f243877199fd96bcc842f27a1656ac	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
20.0.0-12964-supported-dbs-edb-migration	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.15444	110	EXECUTED	9:a6b18a8e38062df5793edbe064f4aecd	dropIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE; createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.156752	111	MARK_RAN	9:1a6fcaa85e20bdeae0a9ce49b41946a5	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
client-attributes-string-accomodation-fixed-pre-drop-index	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.160491	112	EXECUTED	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.166097	113	EXECUTED	9:3f332e13e90739ed0c35b0b25b7822ca	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
client-attributes-string-accomodation-fixed-post-create-index	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-04 14:57:04.169035	114	MARK_RAN	9:bd2bd0fc7768cf0845ac96a8786fa735	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
21.0.2-17277	keycloak	META-INF/jpa-changelog-21.0.2.xml	2026-09-04 14:57:04.178204	115	EXECUTED	9:7ee1f7a3fb8f5588f171fb9a6ab623c0	customChange		\N	4.33.0	\N	\N	8533818227
21.1.0-19404	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-09-04 14:57:04.187258	116	EXECUTED	9:3d7e830b52f33676b9d64f7f2b2ea634	modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER		\N	4.33.0	\N	\N	8533818227
21.1.0-19404-2	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-09-04 14:57:04.189496	117	MARK_RAN	9:627d032e3ef2c06c0e1f73d2ae25c26c	addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...		\N	4.33.0	\N	\N	8533818227
22.0.0-17484-updated	keycloak	META-INF/jpa-changelog-22.0.0.xml	2026-09-04 14:57:04.192656	118	EXECUTED	9:90af0bfd30cafc17b9f4d6eccd92b8b3	customChange		\N	4.33.0	\N	\N	8533818227
23.0.0-12062	keycloak	META-INF/jpa-changelog-23.0.0.xml	2026-09-04 14:57:04.197947	120	EXECUTED	9:2168fbe728fec46ae9baf15bf80927b8	addColumn tableName=COMPONENT_CONFIG; update tableName=COMPONENT_CONFIG; dropColumn columnName=VALUE, tableName=COMPONENT_CONFIG; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=COMPONENT_CONFIG		\N	4.33.0	\N	\N	8533818227
23.0.0-17258	keycloak	META-INF/jpa-changelog-23.0.0.xml	2026-09-04 14:57:04.203803	121	EXECUTED	9:36506d679a83bbfda85a27ea1864dca8	addColumn tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
24.0.0-9758	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-09-04 14:57:04.297934	122	EXECUTED	9:502c557a5189f600f0f445a9b49ebbce	addColumn tableName=USER_ATTRIBUTE; addColumn tableName=FED_USER_ATTRIBUTE; createIndex indexName=USER_ATTR_LONG_VALUES, tableName=USER_ATTRIBUTE; createIndex indexName=FED_USER_ATTR_LONG_VALUES, tableName=FED_USER_ATTRIBUTE; createIndex indexName...		\N	4.33.0	\N	\N	8533818227
24.0.0-9758-2	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-09-04 14:57:04.300057	123	EXECUTED	9:bf0fdee10afdf597a987adbf291db7b2	customChange		\N	4.33.0	\N	\N	8533818227
24.0.0-26618-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-09-04 14:57:04.30267	124	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
24.0.0-26618-reindex	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-09-04 14:57:04.326814	125	EXECUTED	9:08707c0f0db1cef6b352db03a60edc7f	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
24.0.0-26618-edb-migration	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-09-04 14:57:04.354513	126	EXECUTED	9:2f684b29d414cd47efe3a3599f390741	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES; createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
24.0.2-27228	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-09-04 14:57:04.358161	127	EXECUTED	9:eaee11f6b8aa25d2cc6a84fb86fc6238	customChange		\N	4.33.0	\N	\N	8533818227
24.0.2-27967-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-09-04 14:57:04.359023	128	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
24.0.2-27967-reindex	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-09-04 14:57:04.360099	129	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-tables	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.363129	130	EXECUTED	9:deda2df035df23388af95bbd36c17cef	addColumn tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.386311	131	EXECUTED	9:3e96709818458ae49f3c679ae58d263a	createIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-cleanup-uss-createdon	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.39154	132	EXECUTED	9:78ab4fc129ed5e8265dbcc3485fba92f	dropIndex indexName=IDX_OFFLINE_USS_CREATEDON, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-cleanup-uss-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.395128	133	EXECUTED	9:de5f7c1f7e10994ed8b62e621d20eaab	dropIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-cleanup-uss-by-usersess	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.399244	134	EXECUTED	9:6eee220d024e38e89c799417ec33667f	dropIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-cleanup-css-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.407119	135	EXECUTED	9:5411d2fb2891d3e8d63ddb55dfa3c0c9	dropIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-2-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.408856	136	MARK_RAN	9:b7ef76036d3126bb83c2423bf4d449d6	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-28265-index-2-not-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.43237	137	EXECUTED	9:23396cf51ab8bc1ae6f0cac7f9f6fcf7	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
25.0.0-org	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.439371	138	EXECUTED	9:5c859965c2c9b9c72136c360649af157	createTable tableName=ORG; addUniqueConstraint constraintName=UK_ORG_NAME, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_GROUP, tableName=ORG; createTable tableName=ORG_DOMAIN		\N	4.33.0	\N	\N	8533818227
unique-consentuser	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.443464	139	EXECUTED	9:5857626a2ea8767e9a6c66bf3a2cb32f	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	8533818227
unique-consentuser-edb-migration	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.452477	140	MARK_RAN	9:5857626a2ea8767e9a6c66bf3a2cb32f	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	8533818227
unique-consentuser-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.454272	141	MARK_RAN	9:b79478aad5adaa1bc428e31563f55e8e	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	8533818227
25.0.0-28861-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-09-04 14:57:04.503572	142	EXECUTED	9:b9acb58ac958d9ada0fe12a5d4794ab1	createIndex indexName=IDX_PERM_TICKET_REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; createIndex indexName=IDX_PERM_TICKET_OWNER, tableName=RESOURCE_SERVER_PERM_TICKET		\N	4.33.0	\N	\N	8533818227
26.0.0-org-alias	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.506309	143	EXECUTED	9:6ef7d63e4412b3c2d66ed179159886a4	addColumn tableName=ORG; update tableName=ORG; addNotNullConstraint columnName=ALIAS, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_ALIAS, tableName=ORG		\N	4.33.0	\N	\N	8533818227
26.0.0-org-group	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.50934	144	EXECUTED	9:da8e8087d80ef2ace4f89d8c5b9ca223	addColumn tableName=KEYCLOAK_GROUP; update tableName=KEYCLOAK_GROUP; addNotNullConstraint columnName=TYPE, tableName=KEYCLOAK_GROUP; customChange		\N	4.33.0	\N	\N	8533818227
26.0.0-org-indexes	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.534312	145	EXECUTED	9:79b05dcd610a8c7f25ec05135eec0857	createIndex indexName=IDX_ORG_DOMAIN_ORG_ID, tableName=ORG_DOMAIN		\N	4.33.0	\N	\N	8533818227
26.0.0-org-group-membership	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.537398	146	EXECUTED	9:a6ace2ce583a421d89b01ba2a28dc2d4	addColumn tableName=USER_GROUP_MEMBERSHIP; update tableName=USER_GROUP_MEMBERSHIP; addNotNullConstraint columnName=MEMBERSHIP_TYPE, tableName=USER_GROUP_MEMBERSHIP		\N	4.33.0	\N	\N	8533818227
31296-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.539957	147	EXECUTED	9:64ef94489d42a358e8304b0e245f0ed4	createTable tableName=REVOKED_TOKEN; addPrimaryKey constraintName=CONSTRAINT_RT, tableName=REVOKED_TOKEN		\N	4.33.0	\N	\N	8533818227
31725-index-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.569456	148	EXECUTED	9:b994246ec2bf7c94da881e1d28782c7b	createIndex indexName=IDX_REV_TOKEN_ON_EXPIRE, tableName=REVOKED_TOKEN		\N	4.33.0	\N	\N	8533818227
26.0.0-idps-for-login	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.61752	149	EXECUTED	9:51f5fffadf986983d4bd59582c6c1604	addColumn tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_REALM_ORG, tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER; customChange		\N	4.33.0	\N	\N	8533818227
26.0.0-32583-drop-redundant-index-on-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.621524	150	EXECUTED	9:24972d83bf27317a055d234187bb4af9	dropIndex indexName=IDX_US_SESS_ID_ON_CL_SESS, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.0.0.32582-remove-tables-user-session-user-session-note-and-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.62776	151	EXECUTED	9:febdc0f47f2ed241c59e60f58c3ceea5	dropTable tableName=CLIENT_SESSION_ROLE; dropTable tableName=CLIENT_SESSION_NOTE; dropTable tableName=CLIENT_SESSION_PROT_MAPPER; dropTable tableName=CLIENT_SESSION_AUTH_STATUS; dropTable tableName=CLIENT_USER_SESSION_NOTE; dropTable tableName=CLI...		\N	4.33.0	\N	\N	8533818227
26.0.0-33201-org-redirect-url	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-09-04 14:57:04.629248	152	EXECUTED	9:4d0e22b0ac68ebe9794fa9cb752ea660	addColumn tableName=ORG		\N	4.33.0	\N	\N	8533818227
29399-jdbc-ping-default	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-09-04 14:57:04.632573	153	EXECUTED	9:007dbe99d7203fca403b89d4edfdf21e	createTable tableName=JGROUPS_PING; addPrimaryKey constraintName=CONSTRAINT_JGROUPS_PING, tableName=JGROUPS_PING		\N	4.33.0	\N	\N	8533818227
26.1.0-34013	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-09-04 14:57:04.635293	154	EXECUTED	9:e6b686a15759aef99a6d758a5c4c6a26	addColumn tableName=ADMIN_EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
26.1.0-34380	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-09-04 14:57:04.636807	155	EXECUTED	9:ac8b9edb7c2b6c17a1c7a11fcf5ccf01	dropTable tableName=USERNAME_LOGIN_FAILURE		\N	4.33.0	\N	\N	8533818227
26.2.0-36750	keycloak	META-INF/jpa-changelog-26.2.0.xml	2026-09-04 14:57:04.640245	156	EXECUTED	9:b49ce951c22f7eb16480ff085640a33a	createTable tableName=SERVER_CONFIG		\N	4.33.0	\N	\N	8533818227
26.2.0-26106	keycloak	META-INF/jpa-changelog-26.2.0.xml	2026-09-04 14:57:04.64358	157	EXECUTED	9:b5877d5dab7d10ff3a9d209d7beb6680	addColumn tableName=CREDENTIAL		\N	4.33.0	\N	\N	8533818227
26.2.6-39866-duplicate	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-09-04 14:57:04.646879	158	EXECUTED	9:1dc67ccee24f30331db2cba4f372e40e	customChange		\N	4.33.0	\N	\N	8533818227
26.2.6-39866-uk	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-09-04 14:57:04.649687	159	EXECUTED	9:b70b76f47210cf0a5f4ef0e219eac7cd	addUniqueConstraint constraintName=UK_MIGRATION_VERSION, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	8533818227
26.2.6-40088-duplicate	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-09-04 14:57:04.651793	160	EXECUTED	9:cc7e02ed69ab31979afb1982f9670e8f	customChange		\N	4.33.0	\N	\N	8533818227
26.2.6-40088-uk	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-09-04 14:57:04.653668	161	EXECUTED	9:5bb848128da7bc4595cc507383325241	addUniqueConstraint constraintName=UK_MIGRATION_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	8533818227
26.3.0-groups-description	keycloak	META-INF/jpa-changelog-26.3.0.xml	2026-09-04 14:57:04.65516	162	EXECUTED	9:e1a3c05574326fb5b246b73b9a4c4d49	addColumn tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
26.4.0-40933-saml-encryption-attributes	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-09-04 14:57:04.656717	163	EXECUTED	9:7e9eaba362ca105efdda202303a4fe49	customChange		\N	4.33.0	\N	\N	8533818227
26.4.0-51321	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-09-04 14:57:04.673753	164	EXECUTED	9:34bab2bc56f75ffd7e347c580874e306	createIndex indexName=IDX_EVENT_ENTITY_USER_ID_TYPE, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	8533818227
40343-workflow-state-table	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-09-04 14:57:04.712821	165	EXECUTED	9:ed3ab4723ceed210e5b5e60ac4562106	createTable tableName=WORKFLOW_STATE; addPrimaryKey constraintName=PK_WORKFLOW_STATE, tableName=WORKFLOW_STATE; addUniqueConstraint constraintName=UQ_WORKFLOW_RESOURCE, tableName=WORKFLOW_STATE; createIndex indexName=IDX_WORKFLOW_STATE_STEP, table...		\N	4.33.0	\N	\N	8533818227
26.5.0-index-offline-css-by-client	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.737461	166	EXECUTED	9:383e981ce95d16e32af757b7998820f7	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-index-offline-css-by-client-storage-provider	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.757473	167	EXECUTED	9:f5bc200e6fa7d7e483854dee535ca425	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT_STORAGE_PROVIDER, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-idp-config-allow-null-fixed-drop-mssql-index	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.758343	168	MARK_RAN	9:50c51d2c98cd1d624eb1c485c3cf1f75	dropIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	8533818227
26.5.0-idp-config-allow-null	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.762663	169	EXECUTED	9:b667fb087874303b324c1af7fae4f606	dropDefaultValue columnName=TRUST_EMAIL, tableName=IDENTITY_PROVIDER; dropNotNullConstraint columnName=TRUST_EMAIL, tableName=IDENTITY_PROVIDER; dropNotNullConstraint columnName=STORE_TOKEN, tableName=IDENTITY_PROVIDER; dropDefaultValue columnName...		\N	4.33.0	\N	\N	8533818227
26.5.0-idp-config-allow-null-fixed-create-mssql-index	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.763343	170	MARK_RAN	9:dcbbb24c151c3b0b59f12fede23cc94d	createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	8533818227
26.5.0-remove-workflow-provider-id-column	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.788005	171	EXECUTED	9:d8eeb324484d45e946d03b953e168b21	dropIndex indexName=IDX_WORKFLOW_STATE_PROVIDER, tableName=WORKFLOW_STATE; createIndex indexName=IDX_WORKFLOW_STATE_PROVIDER, tableName=WORKFLOW_STATE; dropColumn columnName=WORKFLOW_PROVIDER_ID, tableName=WORKFLOW_STATE		\N	4.33.0	\N	\N	8533818227
26.5.0-add-remember-me	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.790404	172	EXECUTED	9:a7273ea8b21bd2f674c9c49141999f05	addColumn tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-add-sess-refresh-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.812112	173	EXECUTED	9:ce49383d317ccbcd3434d1f21172b0b7	createIndex indexName=IDX_USER_SESSION_EXPIRATION_CREATED, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-add-sess-create-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.839043	174	EXECUTED	9:aaee09e23a4d8468fbc5c51b7b314c58	createIndex indexName=IDX_USER_SESSION_EXPIRATION_LAST_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-drop-sess-refresh-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.84253	175	EXECUTED	9:f0082210b6ccbbaf81287c27aa23753c	dropIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	8533818227
26.5.0-mysql-mariadb-default-charset-collation	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.843275	176	MARK_RAN	9:1b383fa60d2db0a8952b365e725f9d16	customChange		\N	4.33.0	\N	\N	8533818227
26.5.0-invitations-table-fixed2	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-09-04 14:57:04.911731	177	EXECUTED	9:322cb11fc03181903dcd67a54f8b3cf0	createTable tableName=ORG_INVITATION; addForeignKeyConstraint baseTableName=ORG_INVITATION, constraintName=FK_ORG_INVITATION_ORG, referencedTableName=ORG; createIndex indexName=IDX_ORG_INVITATION_ORG_ID, tableName=ORG_INVITATION; createIndex index...		\N	4.33.0	\N	\N	8533818227
26.6.0-45009-broker-link-user-id	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:04.931676	178	EXECUTED	9:05026bbbc8d2ead5afcbda2f5fdf3a2b	createIndex indexName=IDX_BROKER_LINK_USER_ID, tableName=BROKER_LINK		\N	4.33.0	\N	\N	8533818227
26.6.0-45009-broker-link-identity-provider	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:04.953404	179	EXECUTED	9:7d9a0253c9de7be754efef8bba4265bd	createIndex indexName=IDX_BROKER_LINK_IDENTITY_PROVIDER, tableName=BROKER_LINK		\N	4.33.0	\N	\N	8533818227
26.6.0-org-group-relationship	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:04.979157	180	EXECUTED	9:05685853fba030f53548ac6bf23245e3	addColumn tableName=KEYCLOAK_GROUP; addForeignKeyConstraint baseTableName=KEYCLOAK_GROUP, constraintName=FK_GROUP_ORGANIZATION, referencedTableName=ORG; createIndex indexName=IDX_GROUP_ORG_ID, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
26.6.0-44424-index-css-user-session-and-offline	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.001601	181	EXECUTED	9:a704d8598df241a3fd3cb91b6ab4b2d4	createIndex indexName=IDX_OFFLINE_CSS_BY_USER_SESSION_AND_OFFLINE, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.6.0-44424-create-realm-in-client-session	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.007394	182	EXECUTED	9:77dbbc72d943e98cfe472ba8cc56a31c	addColumn tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.6.0-44424-set-realm-in-client-session	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.010775	183	EXECUTED	9:3964a3148d32a55ef81126e23cdf6721	customChange		\N	4.33.0	\N	\N	8533818227
26.6.0-44424-idx-css-realm-and-clients	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.042768	184	EXECUTED	9:a093877fff41185ac24103be80e00968	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT_AND_REALM, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	8533818227
26.6.0-add-last-modified-timestamp-user	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.045858	185	EXECUTED	9:8aa583d2cdd9e913dff42fecd626c560	addColumn tableName=USER_ENTITY		\N	4.33.0	\N	\N	8533818227
26.6.0-add-timestamps-group	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.04805	186	EXECUTED	9:4363d45dc25105a3fc5db9ff6936b0a9	addColumn tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	8533818227
26.6.0-43829-user-created-timestamp-index	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.07225	187	EXECUTED	9:f2531a49b8bb21a7a97966d88fd1a411	createIndex indexName=IDX_USER_CREATED_TIMESTAMP, tableName=USER_ENTITY		\N	4.33.0	\N	\N	8533818227
26.6.0-48716-create-mssql-idp-index	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-09-04 14:57:05.073153	188	MARK_RAN	9:dcbbb24c151c3b0b59f12fede23cc94d	createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	8533818227
26.7.0-jdbcping-timestamp	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.075223	189	EXECUTED	9:9a91f62e494bd013594e007b74d01638	addColumn tableName=JGROUPS_PING		\N	4.33.0	\N	\N	8533818227
26.7.0-45292-realm-display-name-add-column	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.077366	190	EXECUTED	9:1de8c7824ce4fd7c739db6195f42be21	addColumn tableName=REALM		\N	4.33.0	\N	\N	8533818227
26.7.0-45292-realm-display-name-migrate-data	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.079242	191	EXECUTED	9:293096bc554dd51428d1d9882f2de1dd	customChange		\N	4.33.0	\N	\N	8533818227
26.7.0-45292-realm-display-name-remove-attribute	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.081043	192	EXECUTED	9:a08357e3b0908c09d478e692cf82f865	delete tableName=REALM_ATTRIBUTE		\N	4.33.0	\N	\N	8533818227
26.7.0-verifiable-credential	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.085825	193	EXECUTED	9:68d8df23794085e79ba08b5046cba31d	createTable tableName=USER_VER_CREDENTIAL; addPrimaryKey constraintName=CONSTRAINT_VCRED_PM, tableName=USER_VER_CREDENTIAL; addForeignKeyConstraint baseTableName=USER_VER_CREDENTIAL, constraintName=FK_VCRED_USER, referencedTableName=USER_ENTITY; a...		\N	4.33.0	\N	\N	8533818227
26.7.0-federated-verifiable-credentials-1	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.114305	194	EXECUTED	9:49092fa73b1c2b3afca48d91b8111c65	createTable tableName=FED_USER_VER_CREDENTIAL; addUniqueConstraint constraintName=UK_FED_USER_VC, tableName=FED_USER_VER_CREDENTIAL; createIndex indexName=IDX_FED_USER_VC_REALM_USER, tableName=FED_USER_VER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
26.7.0-outbox	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.198073	195	EXECUTED	9:338b2743ca1be95f895d8f9b0cbe7b55	createTable tableName=OUTBOX_ENTRY; addUniqueConstraint constraintName=UC_OUTBOX_KIND_OWNER_CORRELATION, tableName=OUTBOX_ENTRY; createIndex indexName=IDX_OUTBOX_DRAIN, tableName=OUTBOX_ENTRY; createIndex indexName=IDX_OUTBOX_REALM, tableName=OUTB...		\N	4.33.0	\N	\N	8533818227
26.7.0-9686-dynamic-scopes-consent	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.202056	196	EXECUTED	9:fb689bc3ff64e174d6319014b38876f1	addColumn tableName=USER_CONSENT_CLIENT_SCOPE; dropPrimaryKey constraintName=CONSTRAINT_GRNTCSNT_CLSC_PM, tableName=USER_CONSENT_CLIENT_SCOPE; addPrimaryKey constraintName=CONSTRAINT_GRNTCSNT_CLSC_PM, tableName=USER_CONSENT_CLIENT_SCOPE; addColumn...		\N	4.33.0	\N	\N	8533818227
26.7.0-46204-issued-ver-credential-table	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.23289	197	EXECUTED	9:4918c6f68ba90ce417f1aaa031013168	createTable tableName=ISSUED_VER_CREDENTIAL; addPrimaryKey constraintName=PK_ISSUED_VER_CREDENTIAL, tableName=ISSUED_VER_CREDENTIAL; addForeignKeyConstraint baseTableName=ISSUED_VER_CREDENTIAL, constraintName=FK_ISSUED_VER_CREDENTIAL_USER, referen...		\N	4.33.0	\N	\N	8533818227
26.7.0-issued-ver-credential-expires-at-index	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.254946	198	EXECUTED	9:ab9e4c0c9f21d9217ffe52968a3cf732	createIndex indexName=IDX_ISSUED_VER_CREDENTIAL_EXPIRES_AT, tableName=ISSUED_VER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
26.7.0-issued-ver-credential-vc-id-index	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.275418	199	EXECUTED	9:1c9b18926e48b4b66d0341400bd13834	createIndex indexName=IDX_ISSUED_VER_CREDENTIAL_VC, tableName=ISSUED_VER_CREDENTIAL		\N	4.33.0	\N	\N	8533818227
26.7.0-federated-issued-ver-credential	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.349279	200	EXECUTED	9:3d610f5527879623a0d2362e64fa667f	createTable tableName=FED_ISSUED_VER_CREDENTIAL; addForeignKeyConstraint baseTableName=FED_ISSUED_VER_CREDENTIAL, constraintName=FK_FED_ISSUED_VC_VER_CRED, referencedTableName=FED_USER_VER_CREDENTIAL; createIndex indexName=IDX_FED_ISSUED_VC_USER, ...		\N	4.33.0	\N	\N	8533818227
26.7.0-persistent-auth-session-root-table	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.357206	201	EXECUTED	9:ad622d5eebdf468747a0d08d2367a68e	createTable tableName=ROOT_AUTH_SESSION		\N	4.33.0	\N	\N	8533818227
26.7.0-persistent-auth-session-root-index	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.401696	202	EXECUTED	9:3090cd11d2dfeb5df754f41c0ffa35d7	createIndex indexName=IDX_ROOT_AUTH_SESSION_REALM, tableName=ROOT_AUTH_SESSION		\N	4.33.0	\N	\N	8533818227
26.7.0-persistent-auth-session-table	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.408166	203	EXECUTED	9:609b8a172e43f617bb8920efd2b9ae5f	createTable tableName=AUTH_SESSION; addPrimaryKey constraintName=PK_AUTH_SESSION, tableName=AUTH_SESSION; addForeignKeyConstraint baseTableName=AUTH_SESSION, constraintName=FK_AUTH_SESSION_ROOT, referencedTableName=ROOT_AUTH_SESSION		\N	4.33.0	\N	\N	8533818227
26.7.0-single-use-object-table	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.410789	204	EXECUTED	9:22bc4eb8e456b3b7be2808e457a44cb7	createTable tableName=SINGLE_USE_OBJECT		\N	4.33.0	\N	\N	8533818227
26.7.0-single-use-object-index	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.429584	205	EXECUTED	9:b2ad66c013f48dc131ce109eface7fa5	createIndex indexName=IDX_SINGLE_USE_OBJ_EXPIRE, tableName=SINGLE_USE_OBJECT		\N	4.33.0	\N	\N	8533818227
26.7.0-login-failure-table	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.43235	206	EXECUTED	9:671b50f88904b24ceb02463dd2d0c045	createTable tableName=LOGIN_FAILURE; addPrimaryKey constraintName=PK_LOGIN_FAILURE, tableName=LOGIN_FAILURE		\N	4.33.0	\N	\N	8533818227
26.7.0-login-failure-index	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.457338	207	EXECUTED	9:f554afc6ad14784c99f6ad8811ac30ec	createIndex indexName=IDX_LOGIN_FAILURE_EXPIRE, tableName=LOGIN_FAILURE		\N	4.33.0	\N	\N	8533818227
26.7.0-add-timestamps-client	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.460149	208	EXECUTED	9:df5324c82398b446690b206c07649d40	addColumn tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
26.7.0-add-last-modified-timestamp-client	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.461994	209	EXECUTED	9:bae67d2faa5438ee35adfbb20a53c3c6	addColumn tableName=CLIENT		\N	4.33.0	\N	\N	8533818227
26.7.0-cluster-event	keycloak	META-INF/jpa-changelog-26.7.0.xml	2026-09-04 14:57:05.482798	210	EXECUTED	9:556b201eb9c378fa05d5bf22ec9c8dcf	createTable tableName=CLUSTER_EVENT; addPrimaryKey constraintName=PK_CLUSTER_EVENT, tableName=CLUSTER_EVENT; createIndex indexName=IDX_CLUSTER_EVENT_TARGET, tableName=CLUSTER_EVENT		\N	4.33.0	\N	\N	8533818227
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
aaddfc62-6c65-40bc-b197-99e305da29de	c5583e46-5117-4a67-9bd7-dfafb54b8c82	t
aaddfc62-6c65-40bc-b197-99e305da29de	00354f55-d261-4796-b63c-70feb6baac24	t
aaddfc62-6c65-40bc-b197-99e305da29de	5551e1d0-c0e1-4b4b-ab91-4ed8a9e20fe5	t
aaddfc62-6c65-40bc-b197-99e305da29de	9b6fac52-921d-4651-9576-2e6309ebad4d	t
aaddfc62-6c65-40bc-b197-99e305da29de	313805c4-3f97-481d-8249-f8e26cf713bd	t
aaddfc62-6c65-40bc-b197-99e305da29de	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0	t
aaddfc62-6c65-40bc-b197-99e305da29de	f5253e6c-2e4b-43a3-8d59-694de430a0da	t
aaddfc62-6c65-40bc-b197-99e305da29de	055566ba-981c-4e8f-b24d-aeaf28648839	t
aaddfc62-6c65-40bc-b197-99e305da29de	89405ce4-bb8c-4171-9bab-b79eabdbb182	t
aaddfc62-6c65-40bc-b197-99e305da29de	18d7c917-5c3e-405d-9c2e-9a6654757652	f
aaddfc62-6c65-40bc-b197-99e305da29de	3abac829-4fda-4af1-987d-762dd251cbfe	f
aaddfc62-6c65-40bc-b197-99e305da29de	183350b2-cd79-4910-b9ba-12e0d22bd938	f
aaddfc62-6c65-40bc-b197-99e305da29de	b9970a0f-7bba-4ba6-8afb-ed51415dc128	f
aaddfc62-6c65-40bc-b197-99e305da29de	dfca62de-1771-4178-9cfc-c554fd823903	f
0b379a43-608e-4ff3-aaf5-6106d6df4979	0a4492f4-3fd9-451f-9e86-fcb9f299c013	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	9d9017a4-e7c9-44c6-b662-5b41132c2077	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	d253a1f5-7599-410a-b32a-7eb3af9c27dc	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	9904ff66-6dcd-464e-9c27-3211a5dce67e	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	052b5c14-ef41-4946-bfab-f5f4357b75d8	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	8be62890-c805-4ed1-b779-90794f6b92b1	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	4e7432a4-8c41-4eab-8d1e-156d4ee293b8	t
0b379a43-608e-4ff3-aaf5-6106d6df4979	c45e8afc-e232-42b8-a6cb-d17551ddcc22	f
0b379a43-608e-4ff3-aaf5-6106d6df4979	5333a2c5-4889-427e-987c-72d11fd63a32	f
0b379a43-608e-4ff3-aaf5-6106d6df4979	8e950914-3ed6-4aee-b800-ed853daa0561	f
0b379a43-608e-4ff3-aaf5-6106d6df4979	2ec129e2-621c-448c-aec1-fd4bece19fdd	f
0b379a43-608e-4ff3-aaf5-6106d6df4979	2b676baf-8495-4862-9fde-f1d15341bcca	f
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id, details_json_long_value) FROM stdin;
\.


--
-- Data for Name: fed_issued_ver_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_issued_ver_credential (id, user_id, realm_id, storage_provider_id, ver_credential_id, issued_at, expires_at, client_id, revision) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id, parameter) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_ver_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_ver_credential (id, user_id, realm_id, storage_provider_id, client_scope_id, revision, user_attributes, created_date, updated_date, version) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only, organization_id, hide_on_login) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: issued_ver_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.issued_ver_credential (id, user_id, ver_credential_id, issued_at, expires_at, client_id, revision) FROM stdin;
\.


--
-- Data for Name: jgroups_ping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jgroups_ping (address, name, cluster_name, ip, coord, last_update, coordinated_by) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.keycloak_group (id, name, parent_group, realm_id, type, description, org_id, created_timestamp, last_modified_timestamp) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	aaddfc62-6c65-40bc-b197-99e305da29de	f	${role_default-roles}	default-roles-master	aaddfc62-6c65-40bc-b197-99e305da29de	\N	\N
08b7ea03-0565-4efb-83de-6a406983d130	aaddfc62-6c65-40bc-b197-99e305da29de	f	${role_create-realm}	create-realm	aaddfc62-6c65-40bc-b197-99e305da29de	\N	\N
a64136f4-6439-4c37-9482-bbe056e823f1	aaddfc62-6c65-40bc-b197-99e305da29de	f	${role_offline-access}	offline_access	aaddfc62-6c65-40bc-b197-99e305da29de	\N	\N
6acbc5ea-0238-4d6c-be26-f2f93fe7e745	aaddfc62-6c65-40bc-b197-99e305da29de	f	${role_uma_authorization}	uma_authorization	aaddfc62-6c65-40bc-b197-99e305da29de	\N	\N
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	aaddfc62-6c65-40bc-b197-99e305da29de	f	${role_admin}	admin	aaddfc62-6c65-40bc-b197-99e305da29de	\N	\N
d77d6af6-2502-4633-8ad4-985504021d31	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-events}	manage-events	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
ffb24f27-6bae-4e66-ae16-9e7a6af3e51c	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_query-users}	query-users	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
e5b568db-5d72-49d0-86b1-a10187eca0d6	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-organizations}	view-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
7190b6bb-a767-4e2e-a1bc-9f1e811203b3	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-users}	view-users	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
5bef09b8-09b5-4fef-8b6c-4323006a89a0	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-organizations}	manage-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
fe8d186e-df26-4868-908b-e6f8ae333219	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-identity-providers}	view-identity-providers	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
830e9828-4803-4ccc-b19d-322f53d682f0	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-clients}	manage-clients	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
4d3115e6-6fd0-4404-9a60-f4b162b750b4	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_impersonation}	impersonation	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
8f368a01-f660-413f-b909-2153952c0695	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-authorization}	manage-authorization	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
9df27f25-543c-480c-8b28-ac0e366f0d1b	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_query-clients}	query-clients	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
fb7f660e-b1f8-4579-9d6c-a62b51c348a8	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-realm}	view-realm	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
7be7fff1-035d-47dc-b9d0-b2acac8ed92d	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-identity-providers}	manage-identity-providers	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
85fdb387-ac9b-459b-9f38-92d42dc2d189	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_query-organizations}	query-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
791cf557-34cd-4ffa-8178-7b360a3b42c9	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-events}	view-events	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
36d88fe8-1a5e-41fc-8a48-48898c052592	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-users}	manage-users	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
af42fc26-08d8-42b8-b465-0a759ee1e252	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-clients}	view-clients	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
6dec2d1e-5801-49f4-b0a8-1f0b717caf53	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_create-client}	create-client	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
d6e0cb04-bf96-4a2b-8374-67d4f603ca45	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_query-realms}	query-realms	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
51d32af5-cd8c-417b-ab1c-0e0012c5ec39	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_manage-realm}	manage-realm	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
ff331fc9-7a2b-4795-8dea-739a574be8df	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_view-authorization}	view-authorization	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
78970e21-8cd0-46ff-90c6-e68e15178236	131c275f-d8a5-45c6-bde6-be22cc8d1385	t	${role_query-groups}	query-groups	aaddfc62-6c65-40bc-b197-99e305da29de	131c275f-d8a5-45c6-bde6-be22cc8d1385	\N
fb9d65dc-1e75-4d02-a572-bc261ee64ca8	43c32d49-0d14-470e-b663-988f6201d387	t	${role_read-token}	read-token	aaddfc62-6c65-40bc-b197-99e305da29de	43c32d49-0d14-470e-b663-988f6201d387	\N
d7b862d1-5cc0-4945-96d1-bac1aea07f45	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-identity-providers}	view-identity-providers	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
78cb047a-e976-4f15-ae25-501ab512a856	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-realm}	manage-realm	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
610dafdf-d98d-4210-b025-f7698d1136e7	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-authorization}	manage-authorization	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
a6d6ac15-0f18-4888-95c9-5258b8d118de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-identity-providers}	manage-identity-providers	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
ec286fc7-e26d-4d39-93d0-56ae14b7f688	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_query-realms}	query-realms	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
947fc9a0-20d8-4211-88f2-4f2cf0d1f774	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-authorization}	view-authorization	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
b613b23b-3ad2-40c6-9166-6813b3469060	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-clients}	view-clients	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
c4c4b0a6-b881-4bc5-a53c-56060a4869da	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_query-groups}	query-groups	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
5d15431c-4815-44b2-b781-c157104af853	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-events}	view-events	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
923368af-15f9-4e1c-aa23-ae5a8de425d2	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_create-client}	create-client	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
be13dc9d-d1e4-40dd-8474-b2f8953de823	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_query-organizations}	query-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
f6a3da52-cba5-4470-b03f-a9ae191eafcd	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_query-users}	query-users	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
deada3d6-c3e8-40e1-8b5b-9beb0ad2caa1	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-realm}	view-realm	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
0dd98a06-d316-4dbf-8eba-7da30fcfa682	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-users}	manage-users	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
f2089b3d-889e-4c56-ab76-bc75d2bcb6b7	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_impersonation}	impersonation	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
42532c9d-dd3a-4ebc-b6a3-b03916ca8c70	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-organizations}	view-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
a3e91426-f833-44d1-b4f5-f8b7df13a6b6	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-events}	manage-events	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
9a98ed26-ff60-4c50-b32a-fb7036c17848	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-organizations}	manage-organizations	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
f653c8d1-8fd8-4aee-8f1f-522965b77ba1	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_manage-clients}	manage-clients	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
b500a851-aa8e-4a06-83a4-77de5dec5054	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_query-clients}	query-clients	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
5d97cecf-8893-42b0-be11-90c67b9f65bb	11977ab8-d817-442b-abe2-b1d5bdd95ce8	t	${role_view-users}	view-users	aaddfc62-6c65-40bc-b197-99e305da29de	11977ab8-d817-442b-abe2-b1d5bdd95ce8	\N
674ab693-f334-4f36-821f-36cdb60f2853	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_view-applications}	view-applications	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
f42993c6-32af-4721-9f96-2498c6f87303	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_delete-account}	delete-account	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
aee743f3-7bda-4e8b-952d-9bd67142dd36	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_view-profile}	view-profile	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
340bcd37-fbf0-4fe6-8b7a-3671c30de814	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_manage-account-links}	manage-account-links	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
31b0f6ee-e360-472a-97c4-dfa65050394d	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_manage-consent}	manage-consent	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
8f407941-5ffb-4ef6-baba-99911fecc1cb	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_manage-account}	manage-account	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
2edd655c-84d1-42ba-a213-c1fb3822b053	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_view-consent}	view-consent	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
4728feef-9227-42df-bed4-e616e19019dd	b6749730-19c5-4539-b648-70b3d768d4a5	t	${role_view-groups}	view-groups	aaddfc62-6c65-40bc-b197-99e305da29de	b6749730-19c5-4539-b648-70b3d768d4a5	\N
9a4e149d-6038-4d4e-8187-5f862769e293	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	${role_default-roles}	default-roles-rag	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N	\N
d31b0beb-3510-491d-8595-c30241ff4e7a	0b379a43-608e-4ff3-aaf5-6106d6df4979	f		admin	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N	\N
e896a114-c30a-4c85-a6bd-f5a2a66ea5b9	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	${role_offline-access}	offline_access	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N	\N
5fe8cd92-128f-4bb6-beb6-c0908f026060	0b379a43-608e-4ff3-aaf5-6106d6df4979	f		user	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N	\N
f4b0afc2-b852-4e8f-a5e5-e0f9954dd54d	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	${role_uma_authorization}	uma_authorization	0b379a43-608e-4ff3-aaf5-6106d6df4979	\N	\N
f560c322-a615-4c0c-bb10-78fd6a371e14	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_impersonation}	impersonation	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
6049af05-cbcd-49ba-a7cb-bf87748aa1fa	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-authorization}	view-authorization	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
eeedb6c0-b45e-4046-ab39-78f815660c75	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-organizations}	view-organizations	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
8fd3ceef-9b96-452d-8291-9d37f5823441	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-authorization}	manage-authorization	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
5caeaec3-8105-4ea5-bafc-fd556b9ddb76	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-events}	manage-events	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
292ef46e-938d-47d5-ac21-4ac99b1a1f9b	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-users}	manage-users	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
dc86876a-1530-4ac3-88f6-74ce8900acbc	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-users}	view-users	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
9c634712-7d7c-4d05-a7ad-ed95621db73f	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-identity-providers}	view-identity-providers	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
ca76a2c0-d873-4357-9dcb-1b709840e45c	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-clients}	view-clients	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
3a684a29-6a48-4669-bfcb-5c9cdd356b4d	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-events}	view-events	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
6e6cc2b2-cdb6-476a-8e78-51ef7137e8f5	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_view-realm}	view-realm	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
6c611ff1-61bf-49b5-8842-b14ad42b1c42	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-realm}	manage-realm	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
5e720be8-bc74-4b7e-b800-365aa42c7442	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_query-groups}	query-groups	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
d275339f-b328-4bc3-be13-3157df8ef82b	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_query-users}	query-users	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
467235bb-b9cf-4873-b965-76d746bd714a	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-identity-providers}	manage-identity-providers	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
7bb968f8-735c-40d3-ba9c-eddbdfd80203	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-clients}	manage-clients	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
8f5c008f-4ba5-4b03-bb67-269697e1849d	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_query-organizations}	query-organizations	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
c8ce35e3-dd07-4899-97d4-8e209a0424ed	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_realm-admin}	realm-admin	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
ee8c3a1f-ea08-425b-be8f-adf1c8e55d5e	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_create-client}	create-client	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
662a7116-59bc-463d-82ee-cd8fd279f53a	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_manage-organizations}	manage-organizations	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
570a9fc8-cc5b-4e7e-ab77-19c90f3617f0	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_query-clients}	query-clients	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
4b94ca5a-920f-4ff1-82ed-e183d3a3039b	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	t	${role_query-realms}	query-realms	0b379a43-608e-4ff3-aaf5-6106d6df4979	d32060bb-b42d-4f5b-a0b8-9ae1864bfca6	\N
07f54d20-87e6-499e-b8c9-162ef0b29a8c	b78d4c63-f8da-4b2f-9461-a549243d1209	t	${role_read-token}	read-token	0b379a43-608e-4ff3-aaf5-6106d6df4979	b78d4c63-f8da-4b2f-9461-a549243d1209	\N
db35a8da-587a-4a58-bd44-98f6275b766d	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_manage-account}	manage-account	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
a3f1fcac-88ce-48d6-8544-98bf156b54d7	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_view-consent}	view-consent	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
7f52f206-c639-42e0-8a35-48852731c93e	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_delete-account}	delete-account	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
bef3e309-9fee-4914-8d6a-6b646cc19d86	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_manage-consent}	manage-consent	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
51d714c1-b2cd-4666-ab37-a38531b80792	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_view-groups}	view-groups	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
db7a9e52-4735-4db2-bdda-0ad58bbe8ee3	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_manage-account-links}	manage-account-links	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
244de787-3429-44d6-96a1-fe063194c79d	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_view-profile}	view-profile	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
7e206d8a-c03b-4d7a-84f2-640aff147ec0	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	t	${role_view-applications}	view-applications	0b379a43-608e-4ff3-aaf5-6106d6df4979	c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	\N
\.


--
-- Data for Name: login_failure; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_failure (realm_id, user_id, failed_login_not_before, num_failures, num_temporary_lockouts, last_failure, last_ip_failure, num_secondary_auth_failures) FROM stdin;
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migration_model (id, version, update_time) FROM stdin;
n15c0	26.7.2	1788533827
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id, version, realm_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh, broker_session_id, version, remember_me) FROM stdin;
\.


--
-- Data for Name: org; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.org (id, enabled, realm_id, group_id, name, description, alias, redirect_url) FROM stdin;
\.


--
-- Data for Name: org_domain; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.org_domain (id, name, verified, org_id) FROM stdin;
\.


--
-- Data for Name: org_invitation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.org_invitation (id, organization_id, email, first_name, last_name, created_at, expires_at, invite_link) FROM stdin;
\.


--
-- Data for Name: outbox_entry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.outbox_entry (id, entry_kind, realm_id, owner_id, container_id, correlation_id, entry_type, payload, metadata, status, attempts, next_attempt_at, last_error, created_at, delivered_at) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
cd2dc8a4-5097-4222-bf42-43d91a03e525	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	3118f71b-07d0-4ba0-b2be-6ac028e2f2a0
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	b9970a0f-7bba-4ba6-8afb-ed51415dc128
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	b9970a0f-7bba-4ba6-8afb-ed51415dc128
d435168b-235a-4d96-8f89-1f2d0d29abda	acr loa level	openid-connect	oidc-acr-mapper	\N	055566ba-981c-4e8f-b24d-aeaf28648839
d48abded-233d-4ab5-8129-f09691237dff	AuthnContextClassRef	saml	saml-authn-context-class-ref-mapper	\N	5551e1d0-c0e1-4b4b-ab91-4ed8a9e20fe5
5554d925-2d1d-46e0-967d-a52b844a4878	email	openid-connect	oidc-usermodel-attribute-mapper	\N	313805c4-3f97-481d-8249-f8e26cf713bd
bc34e187-affa-4fa5-ae82-37b1cb992c9b	email verified	openid-connect	oidc-usermodel-property-mapper	\N	313805c4-3f97-481d-8249-f8e26cf713bd
9f913b70-6520-438f-98be-5f34e2e04d7c	address	openid-connect	oidc-address-mapper	\N	3abac829-4fda-4af1-987d-762dd251cbfe
b917e02a-d7d2-4242-8521-03b507cb0b73	role list	saml	saml-role-list-mapper	\N	c5583e46-5117-4a67-9bd7-dfafb54b8c82
d7232051-3f8c-42d6-bbd8-ce9d20a21113	website	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
a3fb9064-2b64-4e9f-a442-99ad073d0794	full name	openid-connect	oidc-full-name-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
d13e4042-ac1f-4a1d-87bc-378849f103be	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
5dedb80f-c754-4308-b523-547fa43e6419	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
a34f12a4-5f5a-4414-9c67-51fca0c91fed	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
41524fb6-abad-4b56-b784-91b7af29db5c	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
46ce46d5-2135-4dad-a5f0-b60244ac46c0	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
91bfe55e-1920-4158-ae97-db3184e6fe80	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
42b5ec88-42a1-43c6-8486-eb68e52fa15d	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
61107f0d-5f11-4ff0-96fd-078edee96113	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
3c9480c9-10f1-4265-9263-101b22b133a1	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
3595b1b7-e170-48d6-a040-478b16574604	username	openid-connect	oidc-usermodel-attribute-mapper	\N	9b6fac52-921d-4651-9576-2e6309ebad4d
404fa02a-5162-4869-ab59-2b3eba13057b	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	\N	b03f2e57-24ee-4881-9d81-914accf78412
3b61b906-2d2a-4786-8886-3b4000c1c2c9	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	\N	b03f2e57-24ee-4881-9d81-914accf78412
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	\N	b03f2e57-24ee-4881-9d81-914accf78412
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	organization	openid-connect	oidc-organization-membership-mapper	\N	dfca62de-1771-4178-9cfc-c554fd823903
58249087-ad0e-4e7b-90fa-3b94f688ad97	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	f5253e6c-2e4b-43a3-8d59-694de430a0da
12a1455a-92d0-4594-b8a9-cc525daa5906	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	89405ce4-bb8c-4171-9bab-b79eabdbb182
06db9113-66e3-4b2b-9758-8dbf47c008d8	sub	openid-connect	oidc-sub-mapper	\N	89405ce4-bb8c-4171-9bab-b79eabdbb182
3aa6dff5-f1be-46ba-ab0a-c90c8e78ea9e	organization	saml	saml-organization-membership-mapper	\N	00354f55-d261-4796-b63c-70feb6baac24
cd4a2266-443b-4b25-a968-0ca38c8a3776	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	183350b2-cd79-4910-b9ba-12e0d22bd938
538a0460-b901-4cbf-b313-6cc914b4b66d	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	183350b2-cd79-4910-b9ba-12e0d22bd938
67a647e7-55cc-44ed-8bbd-05eb84bdee11	audience resolve	openid-connect	oidc-audience-resolve-mapper	c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	\N
6a39bda4-e1fe-4606-be60-0e0cef75facf	locale	openid-connect	oidc-usermodel-attribute-mapper	13d7c309-40a4-4da8-96e4-d38563094724	\N
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	8e950914-3ed6-4aee-b800-ed853daa0561
36031835-4b40-49a1-bff1-a5e4b04e6d8d	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	8e950914-3ed6-4aee-b800-ed853daa0561
72949230-bd89-4b23-ae2d-ea659c4c9a72	organization	saml	saml-organization-membership-mapper	\N	9d9017a4-e7c9-44c6-b662-5b41132c2077
b5b0d9b6-c123-4d67-b21f-a9df8a7fb323	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	052b5c14-ef41-4946-bfab-f5f4357b75d8
bd699d86-0940-4c56-87e2-e416daf5cb5d	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	052b5c14-ef41-4946-bfab-f5f4357b75d8
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	052b5c14-ef41-4946-bfab-f5f4357b75d8
03c7ba55-8614-48ee-abab-770d426565e7	acr loa level	openid-connect	oidc-acr-mapper	\N	be0a2b5e-3595-4b6a-9acb-7e20d13ce7fa
387e28bc-3d4a-436b-901a-6ab641f17453	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	4e7432a4-8c41-4eab-8d1e-156d4ee293b8
d45052ae-eed3-48ce-ad91-04d6c14396b7	sub	openid-connect	oidc-sub-mapper	\N	4e7432a4-8c41-4eab-8d1e-156d4ee293b8
d7e4d07c-a93d-43e0-86cb-9c47b970139f	email	openid-connect	oidc-usermodel-attribute-mapper	\N	9904ff66-6dcd-464e-9c27-3211a5dce67e
72740399-8a36-45f6-a116-dbdb652a2e75	email verified	openid-connect	oidc-usermodel-property-mapper	\N	9904ff66-6dcd-464e-9c27-3211a5dce67e
46edff74-43ba-4aea-adab-4210d46a093c	organization	openid-connect	oidc-organization-membership-mapper	\N	2b676baf-8495-4862-9fde-f1d15341bcca
e4b6027d-919c-4d1f-90bc-2fc9297346bd	role list	saml	saml-role-list-mapper	\N	0a4492f4-3fd9-451f-9e86-fcb9f299c013
188e2ddc-9057-4df7-8f83-cef97ddf7b77	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	2ec129e2-621c-448c-aec1-fd4bece19fdd
375e818c-7ea2-4c27-bb88-ad369a47c251	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	2ec129e2-621c-448c-aec1-fd4bece19fdd
eca57b14-2f9f-4bc3-abad-5a07a10beb3a	AuthnContextClassRef	saml	saml-authn-context-class-ref-mapper	\N	d253a1f5-7599-410a-b32a-7eb3af9c27dc
0325baae-33c4-4565-bb27-713403aa28e9	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	\N	dbd4f101-fe82-4a49-8c4b-a1d5aac1808a
ffd7bbdd-9584-4d82-81a1-f6694e477e95	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	\N	dbd4f101-fe82-4a49-8c4b-a1d5aac1808a
1beaec86-5424-4e30-bb8b-2aa2c383906f	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	\N	dbd4f101-fe82-4a49-8c4b-a1d5aac1808a
a993ed4d-4285-4dcb-b143-92352f90137e	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	8be62890-c805-4ed1-b779-90794f6b92b1
4be5e133-df0c-46ec-9dd6-6497e1f710c1	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
ed179c93-8600-4009-80aa-e471e6fcab83	website	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
955ba5d6-edd5-423e-9169-6780aca32716	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
bc7cb1ba-d943-4ae4-80a1-c7f765079e2c	full name	openid-connect	oidc-full-name-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
4c921a6b-b673-4a8f-aed5-3ed7307714a7	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
e9f54358-0f43-40fa-9548-12ba745dfaa0	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
0769894d-70c8-4d21-b225-f523ce216985	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
bf026787-adc2-457e-8b21-5aa995f7cac6	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
81a608c1-6ecf-40ef-b590-a5ed5a75952e	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
fc7ae03f-374d-4c02-a88a-e1332fd87a54	username	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
5104f0ba-b529-4c61-8417-007beec81eb8	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
80817211-5395-4518-a9b6-3f2e602f43b1	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	bf17eae4-1c30-4655-9ae9-7440d8e8cfb8
32904af5-8942-4d9d-8c2f-64b897f4f40b	address	openid-connect	oidc-address-mapper	\N	5333a2c5-4889-427e-987c-72d11fd63a32
17624ce1-08cd-4e22-865c-bfaba05d0e96	audience resolve	openid-connect	oidc-audience-resolve-mapper	af6f50f5-ba18-410b-9f03-544a93928f96	\N
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	carservice-audience	openid-connect	oidc-audience-mapper	ac96be9b-608d-46f9-9c11-35c6b36e70c7	\N
254d4f60-b787-4aff-8810-66ccacb661e4	locale	openid-connect	oidc-usermodel-attribute-mapper	519682a7-2e80-40dd-b373-d40041557f9c	\N
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	aiservice-audience	openid-connect	oidc-audience-mapper	ac96be9b-608d-46f9-9c11-35c6b36e70c7	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	foo	user.attribute
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	true	introspection.token.claim
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	true	access.token.claim
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	realm_access.roles	claim.name
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	String	jsonType.label
a7b0381f-262f-40a3-be9a-9137b1a7c9f1	true	multivalued
cd2dc8a4-5097-4222-bf42-43d91a03e525	true	introspection.token.claim
cd2dc8a4-5097-4222-bf42-43d91a03e525	true	access.token.claim
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	foo	user.attribute
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	true	introspection.token.claim
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	true	access.token.claim
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	resource_access.${client_id}.roles	claim.name
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	String	jsonType.label
d8b0c146-ebef-4d13-9ad9-a226cf9a043b	true	multivalued
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	true	introspection.token.claim
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	true	userinfo.token.claim
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	username	user.attribute
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	true	id.token.claim
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	true	access.token.claim
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	upn	claim.name
4df1dddc-d08c-4cd7-91f7-9d4641ba45f6	String	jsonType.label
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	true	introspection.token.claim
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	true	multivalued
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	true	userinfo.token.claim
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	foo	user.attribute
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	true	id.token.claim
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	true	access.token.claim
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	groups	claim.name
a07fa0de-efb7-4c5c-84e2-8d9817c6f616	String	jsonType.label
d435168b-235a-4d96-8f89-1f2d0d29abda	true	id.token.claim
d435168b-235a-4d96-8f89-1f2d0d29abda	true	introspection.token.claim
d435168b-235a-4d96-8f89-1f2d0d29abda	true	access.token.claim
d435168b-235a-4d96-8f89-1f2d0d29abda	true	userinfo.token.claim
5554d925-2d1d-46e0-967d-a52b844a4878	true	introspection.token.claim
5554d925-2d1d-46e0-967d-a52b844a4878	true	userinfo.token.claim
5554d925-2d1d-46e0-967d-a52b844a4878	email	user.attribute
5554d925-2d1d-46e0-967d-a52b844a4878	true	id.token.claim
5554d925-2d1d-46e0-967d-a52b844a4878	true	access.token.claim
5554d925-2d1d-46e0-967d-a52b844a4878	email	claim.name
5554d925-2d1d-46e0-967d-a52b844a4878	String	jsonType.label
bc34e187-affa-4fa5-ae82-37b1cb992c9b	true	introspection.token.claim
bc34e187-affa-4fa5-ae82-37b1cb992c9b	true	userinfo.token.claim
bc34e187-affa-4fa5-ae82-37b1cb992c9b	emailVerified	user.attribute
bc34e187-affa-4fa5-ae82-37b1cb992c9b	true	id.token.claim
bc34e187-affa-4fa5-ae82-37b1cb992c9b	true	access.token.claim
bc34e187-affa-4fa5-ae82-37b1cb992c9b	email_verified	claim.name
bc34e187-affa-4fa5-ae82-37b1cb992c9b	boolean	jsonType.label
9f913b70-6520-438f-98be-5f34e2e04d7c	formatted	user.attribute.formatted
9f913b70-6520-438f-98be-5f34e2e04d7c	country	user.attribute.country
9f913b70-6520-438f-98be-5f34e2e04d7c	true	introspection.token.claim
9f913b70-6520-438f-98be-5f34e2e04d7c	postal_code	user.attribute.postal_code
9f913b70-6520-438f-98be-5f34e2e04d7c	true	userinfo.token.claim
9f913b70-6520-438f-98be-5f34e2e04d7c	street	user.attribute.street
9f913b70-6520-438f-98be-5f34e2e04d7c	true	id.token.claim
9f913b70-6520-438f-98be-5f34e2e04d7c	region	user.attribute.region
9f913b70-6520-438f-98be-5f34e2e04d7c	true	access.token.claim
9f913b70-6520-438f-98be-5f34e2e04d7c	locality	user.attribute.locality
b917e02a-d7d2-4242-8521-03b507cb0b73	false	single
b917e02a-d7d2-4242-8521-03b507cb0b73	Basic	attribute.nameformat
b917e02a-d7d2-4242-8521-03b507cb0b73	Role	attribute.name
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	true	introspection.token.claim
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	true	userinfo.token.claim
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	updatedAt	user.attribute
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	true	id.token.claim
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	true	access.token.claim
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	updated_at	claim.name
15e5ce0b-b3ef-4402-b119-8cfc489a2eb1	long	jsonType.label
3595b1b7-e170-48d6-a040-478b16574604	true	introspection.token.claim
3595b1b7-e170-48d6-a040-478b16574604	true	userinfo.token.claim
3595b1b7-e170-48d6-a040-478b16574604	username	user.attribute
3595b1b7-e170-48d6-a040-478b16574604	true	id.token.claim
3595b1b7-e170-48d6-a040-478b16574604	true	access.token.claim
3595b1b7-e170-48d6-a040-478b16574604	preferred_username	claim.name
3595b1b7-e170-48d6-a040-478b16574604	String	jsonType.label
3c9480c9-10f1-4265-9263-101b22b133a1	true	introspection.token.claim
3c9480c9-10f1-4265-9263-101b22b133a1	true	userinfo.token.claim
3c9480c9-10f1-4265-9263-101b22b133a1	nickname	user.attribute
3c9480c9-10f1-4265-9263-101b22b133a1	true	id.token.claim
3c9480c9-10f1-4265-9263-101b22b133a1	true	access.token.claim
3c9480c9-10f1-4265-9263-101b22b133a1	nickname	claim.name
3c9480c9-10f1-4265-9263-101b22b133a1	String	jsonType.label
41524fb6-abad-4b56-b784-91b7af29db5c	true	introspection.token.claim
41524fb6-abad-4b56-b784-91b7af29db5c	true	userinfo.token.claim
41524fb6-abad-4b56-b784-91b7af29db5c	birthdate	user.attribute
41524fb6-abad-4b56-b784-91b7af29db5c	true	id.token.claim
41524fb6-abad-4b56-b784-91b7af29db5c	true	access.token.claim
41524fb6-abad-4b56-b784-91b7af29db5c	birthdate	claim.name
41524fb6-abad-4b56-b784-91b7af29db5c	String	jsonType.label
42b5ec88-42a1-43c6-8486-eb68e52fa15d	true	introspection.token.claim
42b5ec88-42a1-43c6-8486-eb68e52fa15d	true	userinfo.token.claim
42b5ec88-42a1-43c6-8486-eb68e52fa15d	profile	user.attribute
42b5ec88-42a1-43c6-8486-eb68e52fa15d	true	id.token.claim
42b5ec88-42a1-43c6-8486-eb68e52fa15d	true	access.token.claim
42b5ec88-42a1-43c6-8486-eb68e52fa15d	profile	claim.name
42b5ec88-42a1-43c6-8486-eb68e52fa15d	String	jsonType.label
46ce46d5-2135-4dad-a5f0-b60244ac46c0	true	introspection.token.claim
46ce46d5-2135-4dad-a5f0-b60244ac46c0	true	userinfo.token.claim
46ce46d5-2135-4dad-a5f0-b60244ac46c0	firstName	user.attribute
46ce46d5-2135-4dad-a5f0-b60244ac46c0	true	id.token.claim
46ce46d5-2135-4dad-a5f0-b60244ac46c0	true	access.token.claim
46ce46d5-2135-4dad-a5f0-b60244ac46c0	given_name	claim.name
46ce46d5-2135-4dad-a5f0-b60244ac46c0	String	jsonType.label
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	true	introspection.token.claim
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	true	userinfo.token.claim
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	lastName	user.attribute
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	true	id.token.claim
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	true	access.token.claim
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	family_name	claim.name
47c9d39c-6b6b-44f3-a0e1-10cf0a6b6f62	String	jsonType.label
5dedb80f-c754-4308-b523-547fa43e6419	true	introspection.token.claim
5dedb80f-c754-4308-b523-547fa43e6419	true	userinfo.token.claim
5dedb80f-c754-4308-b523-547fa43e6419	middleName	user.attribute
5dedb80f-c754-4308-b523-547fa43e6419	true	id.token.claim
5dedb80f-c754-4308-b523-547fa43e6419	true	access.token.claim
5dedb80f-c754-4308-b523-547fa43e6419	middle_name	claim.name
5dedb80f-c754-4308-b523-547fa43e6419	String	jsonType.label
61107f0d-5f11-4ff0-96fd-078edee96113	true	introspection.token.claim
61107f0d-5f11-4ff0-96fd-078edee96113	true	userinfo.token.claim
61107f0d-5f11-4ff0-96fd-078edee96113	locale	user.attribute
61107f0d-5f11-4ff0-96fd-078edee96113	true	id.token.claim
61107f0d-5f11-4ff0-96fd-078edee96113	true	access.token.claim
61107f0d-5f11-4ff0-96fd-078edee96113	locale	claim.name
61107f0d-5f11-4ff0-96fd-078edee96113	String	jsonType.label
91bfe55e-1920-4158-ae97-db3184e6fe80	true	introspection.token.claim
91bfe55e-1920-4158-ae97-db3184e6fe80	true	userinfo.token.claim
91bfe55e-1920-4158-ae97-db3184e6fe80	picture	user.attribute
91bfe55e-1920-4158-ae97-db3184e6fe80	true	id.token.claim
91bfe55e-1920-4158-ae97-db3184e6fe80	true	access.token.claim
91bfe55e-1920-4158-ae97-db3184e6fe80	picture	claim.name
91bfe55e-1920-4158-ae97-db3184e6fe80	String	jsonType.label
a34f12a4-5f5a-4414-9c67-51fca0c91fed	true	introspection.token.claim
a34f12a4-5f5a-4414-9c67-51fca0c91fed	true	userinfo.token.claim
a34f12a4-5f5a-4414-9c67-51fca0c91fed	gender	user.attribute
a34f12a4-5f5a-4414-9c67-51fca0c91fed	true	id.token.claim
a34f12a4-5f5a-4414-9c67-51fca0c91fed	true	access.token.claim
a34f12a4-5f5a-4414-9c67-51fca0c91fed	gender	claim.name
a34f12a4-5f5a-4414-9c67-51fca0c91fed	String	jsonType.label
a3fb9064-2b64-4e9f-a442-99ad073d0794	true	id.token.claim
a3fb9064-2b64-4e9f-a442-99ad073d0794	true	introspection.token.claim
a3fb9064-2b64-4e9f-a442-99ad073d0794	true	access.token.claim
a3fb9064-2b64-4e9f-a442-99ad073d0794	true	userinfo.token.claim
d13e4042-ac1f-4a1d-87bc-378849f103be	true	introspection.token.claim
d13e4042-ac1f-4a1d-87bc-378849f103be	true	userinfo.token.claim
d13e4042-ac1f-4a1d-87bc-378849f103be	zoneinfo	user.attribute
d13e4042-ac1f-4a1d-87bc-378849f103be	true	id.token.claim
d13e4042-ac1f-4a1d-87bc-378849f103be	true	access.token.claim
d13e4042-ac1f-4a1d-87bc-378849f103be	zoneinfo	claim.name
d13e4042-ac1f-4a1d-87bc-378849f103be	String	jsonType.label
d7232051-3f8c-42d6-bbd8-ce9d20a21113	true	introspection.token.claim
d7232051-3f8c-42d6-bbd8-ce9d20a21113	true	userinfo.token.claim
d7232051-3f8c-42d6-bbd8-ce9d20a21113	website	user.attribute
d7232051-3f8c-42d6-bbd8-ce9d20a21113	true	id.token.claim
d7232051-3f8c-42d6-bbd8-ce9d20a21113	true	access.token.claim
d7232051-3f8c-42d6-bbd8-ce9d20a21113	website	claim.name
d7232051-3f8c-42d6-bbd8-ce9d20a21113	String	jsonType.label
3b61b906-2d2a-4786-8886-3b4000c1c2c9	clientAddress	user.session.note
3b61b906-2d2a-4786-8886-3b4000c1c2c9	true	id.token.claim
3b61b906-2d2a-4786-8886-3b4000c1c2c9	true	introspection.token.claim
3b61b906-2d2a-4786-8886-3b4000c1c2c9	true	access.token.claim
3b61b906-2d2a-4786-8886-3b4000c1c2c9	clientAddress	claim.name
3b61b906-2d2a-4786-8886-3b4000c1c2c9	String	jsonType.label
404fa02a-5162-4869-ab59-2b3eba13057b	client_id	user.session.note
404fa02a-5162-4869-ab59-2b3eba13057b	true	introspection.token.claim
404fa02a-5162-4869-ab59-2b3eba13057b	true	userinfo.token.claim
404fa02a-5162-4869-ab59-2b3eba13057b	true	id.token.claim
404fa02a-5162-4869-ab59-2b3eba13057b	true	access.token.claim
404fa02a-5162-4869-ab59-2b3eba13057b	client_id	claim.name
404fa02a-5162-4869-ab59-2b3eba13057b	String	jsonType.label
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	clientHost	user.session.note
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	true	id.token.claim
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	true	introspection.token.claim
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	true	access.token.claim
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	clientHost	claim.name
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	String	jsonType.label
3b61b906-2d2a-4786-8886-3b4000c1c2c9	true	userinfo.token.claim
fa6d9d27-e54b-45a3-a7c7-0d15470720b7	true	userinfo.token.claim
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	true	introspection.token.claim
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	true	multivalued
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	true	userinfo.token.claim
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	true	id.token.claim
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	true	access.token.claim
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	organization	claim.name
ab90b2cc-bbf8-4e7d-b94a-c413267eb1c0	String	jsonType.label
58249087-ad0e-4e7b-90fa-3b94f688ad97	true	introspection.token.claim
58249087-ad0e-4e7b-90fa-3b94f688ad97	true	access.token.claim
06db9113-66e3-4b2b-9758-8dbf47c008d8	true	introspection.token.claim
06db9113-66e3-4b2b-9758-8dbf47c008d8	true	access.token.claim
12a1455a-92d0-4594-b8a9-cc525daa5906	AUTH_TIME	user.session.note
12a1455a-92d0-4594-b8a9-cc525daa5906	true	introspection.token.claim
12a1455a-92d0-4594-b8a9-cc525daa5906	true	userinfo.token.claim
12a1455a-92d0-4594-b8a9-cc525daa5906	true	id.token.claim
12a1455a-92d0-4594-b8a9-cc525daa5906	true	access.token.claim
12a1455a-92d0-4594-b8a9-cc525daa5906	auth_time	claim.name
12a1455a-92d0-4594-b8a9-cc525daa5906	long	jsonType.label
538a0460-b901-4cbf-b313-6cc914b4b66d	true	introspection.token.claim
538a0460-b901-4cbf-b313-6cc914b4b66d	true	userinfo.token.claim
538a0460-b901-4cbf-b313-6cc914b4b66d	phoneNumber	user.attribute
538a0460-b901-4cbf-b313-6cc914b4b66d	true	id.token.claim
538a0460-b901-4cbf-b313-6cc914b4b66d	true	access.token.claim
538a0460-b901-4cbf-b313-6cc914b4b66d	phone_number	claim.name
538a0460-b901-4cbf-b313-6cc914b4b66d	String	jsonType.label
cd4a2266-443b-4b25-a968-0ca38c8a3776	true	introspection.token.claim
cd4a2266-443b-4b25-a968-0ca38c8a3776	true	userinfo.token.claim
cd4a2266-443b-4b25-a968-0ca38c8a3776	phoneNumberVerified	user.attribute
cd4a2266-443b-4b25-a968-0ca38c8a3776	true	id.token.claim
cd4a2266-443b-4b25-a968-0ca38c8a3776	true	access.token.claim
cd4a2266-443b-4b25-a968-0ca38c8a3776	phone_number_verified	claim.name
cd4a2266-443b-4b25-a968-0ca38c8a3776	boolean	jsonType.label
6a39bda4-e1fe-4606-be60-0e0cef75facf	true	introspection.token.claim
6a39bda4-e1fe-4606-be60-0e0cef75facf	true	userinfo.token.claim
6a39bda4-e1fe-4606-be60-0e0cef75facf	locale	user.attribute
6a39bda4-e1fe-4606-be60-0e0cef75facf	true	id.token.claim
6a39bda4-e1fe-4606-be60-0e0cef75facf	true	access.token.claim
6a39bda4-e1fe-4606-be60-0e0cef75facf	locale	claim.name
6a39bda4-e1fe-4606-be60-0e0cef75facf	String	jsonType.label
36031835-4b40-49a1-bff1-a5e4b04e6d8d	true	introspection.token.claim
36031835-4b40-49a1-bff1-a5e4b04e6d8d	true	userinfo.token.claim
36031835-4b40-49a1-bff1-a5e4b04e6d8d	phoneNumberVerified	user.attribute
36031835-4b40-49a1-bff1-a5e4b04e6d8d	true	id.token.claim
36031835-4b40-49a1-bff1-a5e4b04e6d8d	true	access.token.claim
36031835-4b40-49a1-bff1-a5e4b04e6d8d	phone_number_verified	claim.name
36031835-4b40-49a1-bff1-a5e4b04e6d8d	boolean	jsonType.label
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	true	introspection.token.claim
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	true	userinfo.token.claim
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	phoneNumber	user.attribute
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	true	id.token.claim
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	true	access.token.claim
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	phone_number	claim.name
e22d9a81-c3cd-4ce8-8f4e-5db4f82653a4	String	jsonType.label
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	foo	user.attribute
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	true	introspection.token.claim
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	true	access.token.claim
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	resource_access.${client_id}.roles	claim.name
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	String	jsonType.label
a1688eb9-0d70-48ca-b40b-f8aff1a4bdd8	true	multivalued
b5b0d9b6-c123-4d67-b21f-a9df8a7fb323	true	introspection.token.claim
b5b0d9b6-c123-4d67-b21f-a9df8a7fb323	true	access.token.claim
bd699d86-0940-4c56-87e2-e416daf5cb5d	foo	user.attribute
bd699d86-0940-4c56-87e2-e416daf5cb5d	true	introspection.token.claim
bd699d86-0940-4c56-87e2-e416daf5cb5d	true	access.token.claim
bd699d86-0940-4c56-87e2-e416daf5cb5d	realm_access.roles	claim.name
bd699d86-0940-4c56-87e2-e416daf5cb5d	String	jsonType.label
bd699d86-0940-4c56-87e2-e416daf5cb5d	true	multivalued
03c7ba55-8614-48ee-abab-770d426565e7	true	id.token.claim
03c7ba55-8614-48ee-abab-770d426565e7	true	introspection.token.claim
03c7ba55-8614-48ee-abab-770d426565e7	true	access.token.claim
03c7ba55-8614-48ee-abab-770d426565e7	true	userinfo.token.claim
387e28bc-3d4a-436b-901a-6ab641f17453	AUTH_TIME	user.session.note
387e28bc-3d4a-436b-901a-6ab641f17453	true	introspection.token.claim
387e28bc-3d4a-436b-901a-6ab641f17453	true	userinfo.token.claim
387e28bc-3d4a-436b-901a-6ab641f17453	true	id.token.claim
387e28bc-3d4a-436b-901a-6ab641f17453	true	access.token.claim
387e28bc-3d4a-436b-901a-6ab641f17453	auth_time	claim.name
387e28bc-3d4a-436b-901a-6ab641f17453	long	jsonType.label
d45052ae-eed3-48ce-ad91-04d6c14396b7	true	introspection.token.claim
d45052ae-eed3-48ce-ad91-04d6c14396b7	true	access.token.claim
72740399-8a36-45f6-a116-dbdb652a2e75	true	introspection.token.claim
72740399-8a36-45f6-a116-dbdb652a2e75	true	userinfo.token.claim
72740399-8a36-45f6-a116-dbdb652a2e75	emailVerified	user.attribute
72740399-8a36-45f6-a116-dbdb652a2e75	true	id.token.claim
72740399-8a36-45f6-a116-dbdb652a2e75	true	access.token.claim
72740399-8a36-45f6-a116-dbdb652a2e75	email_verified	claim.name
72740399-8a36-45f6-a116-dbdb652a2e75	boolean	jsonType.label
d7e4d07c-a93d-43e0-86cb-9c47b970139f	true	introspection.token.claim
d7e4d07c-a93d-43e0-86cb-9c47b970139f	true	userinfo.token.claim
d7e4d07c-a93d-43e0-86cb-9c47b970139f	email	user.attribute
d7e4d07c-a93d-43e0-86cb-9c47b970139f	true	id.token.claim
d7e4d07c-a93d-43e0-86cb-9c47b970139f	true	access.token.claim
d7e4d07c-a93d-43e0-86cb-9c47b970139f	email	claim.name
d7e4d07c-a93d-43e0-86cb-9c47b970139f	String	jsonType.label
46edff74-43ba-4aea-adab-4210d46a093c	true	introspection.token.claim
46edff74-43ba-4aea-adab-4210d46a093c	true	multivalued
46edff74-43ba-4aea-adab-4210d46a093c	true	userinfo.token.claim
46edff74-43ba-4aea-adab-4210d46a093c	true	id.token.claim
46edff74-43ba-4aea-adab-4210d46a093c	true	access.token.claim
46edff74-43ba-4aea-adab-4210d46a093c	organization	claim.name
46edff74-43ba-4aea-adab-4210d46a093c	String	jsonType.label
e4b6027d-919c-4d1f-90bc-2fc9297346bd	false	single
e4b6027d-919c-4d1f-90bc-2fc9297346bd	Basic	attribute.nameformat
e4b6027d-919c-4d1f-90bc-2fc9297346bd	Role	attribute.name
188e2ddc-9057-4df7-8f83-cef97ddf7b77	true	introspection.token.claim
188e2ddc-9057-4df7-8f83-cef97ddf7b77	true	multivalued
188e2ddc-9057-4df7-8f83-cef97ddf7b77	true	userinfo.token.claim
188e2ddc-9057-4df7-8f83-cef97ddf7b77	foo	user.attribute
188e2ddc-9057-4df7-8f83-cef97ddf7b77	true	id.token.claim
188e2ddc-9057-4df7-8f83-cef97ddf7b77	true	access.token.claim
188e2ddc-9057-4df7-8f83-cef97ddf7b77	groups	claim.name
188e2ddc-9057-4df7-8f83-cef97ddf7b77	String	jsonType.label
375e818c-7ea2-4c27-bb88-ad369a47c251	true	introspection.token.claim
375e818c-7ea2-4c27-bb88-ad369a47c251	true	userinfo.token.claim
375e818c-7ea2-4c27-bb88-ad369a47c251	username	user.attribute
375e818c-7ea2-4c27-bb88-ad369a47c251	true	id.token.claim
375e818c-7ea2-4c27-bb88-ad369a47c251	true	access.token.claim
375e818c-7ea2-4c27-bb88-ad369a47c251	upn	claim.name
375e818c-7ea2-4c27-bb88-ad369a47c251	String	jsonType.label
0325baae-33c4-4565-bb27-713403aa28e9	client_id	user.session.note
0325baae-33c4-4565-bb27-713403aa28e9	true	introspection.token.claim
0325baae-33c4-4565-bb27-713403aa28e9	true	userinfo.token.claim
0325baae-33c4-4565-bb27-713403aa28e9	true	id.token.claim
0325baae-33c4-4565-bb27-713403aa28e9	true	access.token.claim
0325baae-33c4-4565-bb27-713403aa28e9	client_id	claim.name
0325baae-33c4-4565-bb27-713403aa28e9	String	jsonType.label
1beaec86-5424-4e30-bb8b-2aa2c383906f	clientAddress	user.session.note
1beaec86-5424-4e30-bb8b-2aa2c383906f	true	introspection.token.claim
1beaec86-5424-4e30-bb8b-2aa2c383906f	true	userinfo.token.claim
1beaec86-5424-4e30-bb8b-2aa2c383906f	true	id.token.claim
1beaec86-5424-4e30-bb8b-2aa2c383906f	true	access.token.claim
1beaec86-5424-4e30-bb8b-2aa2c383906f	clientAddress	claim.name
1beaec86-5424-4e30-bb8b-2aa2c383906f	String	jsonType.label
ffd7bbdd-9584-4d82-81a1-f6694e477e95	clientHost	user.session.note
ffd7bbdd-9584-4d82-81a1-f6694e477e95	true	introspection.token.claim
ffd7bbdd-9584-4d82-81a1-f6694e477e95	true	userinfo.token.claim
ffd7bbdd-9584-4d82-81a1-f6694e477e95	true	id.token.claim
ffd7bbdd-9584-4d82-81a1-f6694e477e95	true	access.token.claim
ffd7bbdd-9584-4d82-81a1-f6694e477e95	clientHost	claim.name
ffd7bbdd-9584-4d82-81a1-f6694e477e95	String	jsonType.label
a993ed4d-4285-4dcb-b143-92352f90137e	true	introspection.token.claim
a993ed4d-4285-4dcb-b143-92352f90137e	true	access.token.claim
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	true	introspection.token.claim
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	true	userinfo.token.claim
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	profile	user.attribute
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	true	id.token.claim
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	true	access.token.claim
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	profile	claim.name
04a1dd07-3036-4a2e-8eeb-08d93e1fa53b	String	jsonType.label
0769894d-70c8-4d21-b225-f523ce216985	true	introspection.token.claim
0769894d-70c8-4d21-b225-f523ce216985	true	userinfo.token.claim
0769894d-70c8-4d21-b225-f523ce216985	locale	user.attribute
0769894d-70c8-4d21-b225-f523ce216985	true	id.token.claim
0769894d-70c8-4d21-b225-f523ce216985	true	access.token.claim
0769894d-70c8-4d21-b225-f523ce216985	locale	claim.name
0769894d-70c8-4d21-b225-f523ce216985	String	jsonType.label
4be5e133-df0c-46ec-9dd6-6497e1f710c1	true	introspection.token.claim
4be5e133-df0c-46ec-9dd6-6497e1f710c1	true	userinfo.token.claim
4be5e133-df0c-46ec-9dd6-6497e1f710c1	picture	user.attribute
4be5e133-df0c-46ec-9dd6-6497e1f710c1	true	id.token.claim
4be5e133-df0c-46ec-9dd6-6497e1f710c1	true	access.token.claim
4be5e133-df0c-46ec-9dd6-6497e1f710c1	picture	claim.name
4be5e133-df0c-46ec-9dd6-6497e1f710c1	String	jsonType.label
4c921a6b-b673-4a8f-aed5-3ed7307714a7	true	introspection.token.claim
4c921a6b-b673-4a8f-aed5-3ed7307714a7	true	userinfo.token.claim
4c921a6b-b673-4a8f-aed5-3ed7307714a7	gender	user.attribute
4c921a6b-b673-4a8f-aed5-3ed7307714a7	true	id.token.claim
4c921a6b-b673-4a8f-aed5-3ed7307714a7	true	access.token.claim
4c921a6b-b673-4a8f-aed5-3ed7307714a7	gender	claim.name
4c921a6b-b673-4a8f-aed5-3ed7307714a7	String	jsonType.label
5104f0ba-b529-4c61-8417-007beec81eb8	true	introspection.token.claim
5104f0ba-b529-4c61-8417-007beec81eb8	true	userinfo.token.claim
5104f0ba-b529-4c61-8417-007beec81eb8	zoneinfo	user.attribute
5104f0ba-b529-4c61-8417-007beec81eb8	true	id.token.claim
5104f0ba-b529-4c61-8417-007beec81eb8	true	access.token.claim
5104f0ba-b529-4c61-8417-007beec81eb8	zoneinfo	claim.name
5104f0ba-b529-4c61-8417-007beec81eb8	String	jsonType.label
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	true	introspection.token.claim
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	true	userinfo.token.claim
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	nickname	user.attribute
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	true	id.token.claim
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	true	access.token.claim
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	nickname	claim.name
6a29ac44-efb7-4f53-a80e-e3dddaf0c961	String	jsonType.label
80817211-5395-4518-a9b6-3f2e602f43b1	true	introspection.token.claim
80817211-5395-4518-a9b6-3f2e602f43b1	true	userinfo.token.claim
80817211-5395-4518-a9b6-3f2e602f43b1	updatedAt	user.attribute
80817211-5395-4518-a9b6-3f2e602f43b1	true	id.token.claim
80817211-5395-4518-a9b6-3f2e602f43b1	true	access.token.claim
80817211-5395-4518-a9b6-3f2e602f43b1	updated_at	claim.name
80817211-5395-4518-a9b6-3f2e602f43b1	long	jsonType.label
81a608c1-6ecf-40ef-b590-a5ed5a75952e	true	introspection.token.claim
81a608c1-6ecf-40ef-b590-a5ed5a75952e	true	userinfo.token.claim
81a608c1-6ecf-40ef-b590-a5ed5a75952e	middleName	user.attribute
81a608c1-6ecf-40ef-b590-a5ed5a75952e	true	id.token.claim
81a608c1-6ecf-40ef-b590-a5ed5a75952e	true	access.token.claim
81a608c1-6ecf-40ef-b590-a5ed5a75952e	middle_name	claim.name
81a608c1-6ecf-40ef-b590-a5ed5a75952e	String	jsonType.label
955ba5d6-edd5-423e-9169-6780aca32716	true	introspection.token.claim
955ba5d6-edd5-423e-9169-6780aca32716	true	userinfo.token.claim
955ba5d6-edd5-423e-9169-6780aca32716	firstName	user.attribute
955ba5d6-edd5-423e-9169-6780aca32716	true	id.token.claim
955ba5d6-edd5-423e-9169-6780aca32716	true	access.token.claim
955ba5d6-edd5-423e-9169-6780aca32716	given_name	claim.name
955ba5d6-edd5-423e-9169-6780aca32716	String	jsonType.label
bc7cb1ba-d943-4ae4-80a1-c7f765079e2c	true	id.token.claim
bc7cb1ba-d943-4ae4-80a1-c7f765079e2c	true	introspection.token.claim
bc7cb1ba-d943-4ae4-80a1-c7f765079e2c	true	access.token.claim
bc7cb1ba-d943-4ae4-80a1-c7f765079e2c	true	userinfo.token.claim
bf026787-adc2-457e-8b21-5aa995f7cac6	true	introspection.token.claim
bf026787-adc2-457e-8b21-5aa995f7cac6	true	userinfo.token.claim
bf026787-adc2-457e-8b21-5aa995f7cac6	lastName	user.attribute
bf026787-adc2-457e-8b21-5aa995f7cac6	true	id.token.claim
bf026787-adc2-457e-8b21-5aa995f7cac6	true	access.token.claim
bf026787-adc2-457e-8b21-5aa995f7cac6	family_name	claim.name
bf026787-adc2-457e-8b21-5aa995f7cac6	String	jsonType.label
e9f54358-0f43-40fa-9548-12ba745dfaa0	true	introspection.token.claim
e9f54358-0f43-40fa-9548-12ba745dfaa0	true	userinfo.token.claim
e9f54358-0f43-40fa-9548-12ba745dfaa0	birthdate	user.attribute
e9f54358-0f43-40fa-9548-12ba745dfaa0	true	id.token.claim
e9f54358-0f43-40fa-9548-12ba745dfaa0	true	access.token.claim
e9f54358-0f43-40fa-9548-12ba745dfaa0	birthdate	claim.name
e9f54358-0f43-40fa-9548-12ba745dfaa0	String	jsonType.label
ed179c93-8600-4009-80aa-e471e6fcab83	true	introspection.token.claim
ed179c93-8600-4009-80aa-e471e6fcab83	true	userinfo.token.claim
ed179c93-8600-4009-80aa-e471e6fcab83	website	user.attribute
ed179c93-8600-4009-80aa-e471e6fcab83	true	id.token.claim
ed179c93-8600-4009-80aa-e471e6fcab83	true	access.token.claim
ed179c93-8600-4009-80aa-e471e6fcab83	website	claim.name
ed179c93-8600-4009-80aa-e471e6fcab83	String	jsonType.label
fc7ae03f-374d-4c02-a88a-e1332fd87a54	true	introspection.token.claim
fc7ae03f-374d-4c02-a88a-e1332fd87a54	true	userinfo.token.claim
fc7ae03f-374d-4c02-a88a-e1332fd87a54	username	user.attribute
fc7ae03f-374d-4c02-a88a-e1332fd87a54	true	id.token.claim
fc7ae03f-374d-4c02-a88a-e1332fd87a54	true	access.token.claim
fc7ae03f-374d-4c02-a88a-e1332fd87a54	preferred_username	claim.name
fc7ae03f-374d-4c02-a88a-e1332fd87a54	String	jsonType.label
32904af5-8942-4d9d-8c2f-64b897f4f40b	formatted	user.attribute.formatted
32904af5-8942-4d9d-8c2f-64b897f4f40b	country	user.attribute.country
32904af5-8942-4d9d-8c2f-64b897f4f40b	true	introspection.token.claim
32904af5-8942-4d9d-8c2f-64b897f4f40b	postal_code	user.attribute.postal_code
32904af5-8942-4d9d-8c2f-64b897f4f40b	true	userinfo.token.claim
32904af5-8942-4d9d-8c2f-64b897f4f40b	street	user.attribute.street
32904af5-8942-4d9d-8c2f-64b897f4f40b	true	id.token.claim
32904af5-8942-4d9d-8c2f-64b897f4f40b	region	user.attribute.region
32904af5-8942-4d9d-8c2f-64b897f4f40b	true	access.token.claim
32904af5-8942-4d9d-8c2f-64b897f4f40b	locality	user.attribute.locality
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	carservice	included.client.audience
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	false	id.token.claim
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	true	access.token.claim
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	true	introspection.token.claim
4073c50c-82e5-4016-9dc4-c9e0e4aabdff	false	userinfo.token.claim
254d4f60-b787-4aff-8810-66ccacb661e4	true	introspection.token.claim
254d4f60-b787-4aff-8810-66ccacb661e4	true	userinfo.token.claim
254d4f60-b787-4aff-8810-66ccacb661e4	locale	user.attribute
254d4f60-b787-4aff-8810-66ccacb661e4	true	id.token.claim
254d4f60-b787-4aff-8810-66ccacb661e4	true	access.token.claim
254d4f60-b787-4aff-8810-66ccacb661e4	locale	claim.name
254d4f60-b787-4aff-8810-66ccacb661e4	String	jsonType.label
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	false	id.token.claim
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	false	lightweight.claim
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	true	access.token.claim
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	true	introspection.token.claim
fd8fbc14-039d-4bb1-9deb-fcee02a9be30	aiservice	included.custom.audience
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role, display_name) FROM stdin;
aaddfc62-6c65-40bc-b197-99e305da29de	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	11977ab8-d817-442b-abe2-b1d5bdd95ce8	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	7242da42-1481-40a1-b3d6-3cf71c5b4af0	eee438a4-d81e-45d2-a249-39572490bea8	3122ecab-cc15-4fd6-9ab3-c0b7fcc4abac	2296fa53-ff28-410f-befb-3dedd959a6d1	b8405cc2-299b-4aac-b72c-e2ccb6b5f8cf	2592000	f	900	t	f	840fb855-fdf6-4b22-a3d7-e29f3ea758d1	0	f	0	0	9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	Keycloak
0b379a43-608e-4ff3-aaf5-6106d6df4979	60	300	300				t	f	0	rag	rag	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	131c275f-d8a5-45c6-bde6-be22cc8d1385	1800	t	de	f	f	f	f	0	1	30	6	HmacSHA1	totp	e25308d0-9a81-419f-b97a-a7c7bd64efa1	cdfca0ee-ae82-4bbd-abea-a7e14808ba83	64cedb2e-9cda-4dd9-a33d-57d4232ad345	34a57485-9f1b-4196-bf76-18ad610397d6	4d7e8fa5-da3e-49fa-87d1-bc915734612a	2592000	f	900	t	f	0cb648a5-9ca8-4d62-8664-86abe4cf2aa2	0	f	0	0	9a4e149d-6038-4d4e-8187-5f862769e293	\N
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	aaddfc62-6c65-40bc-b197-99e305da29de	
_browser_header.xContentTypeOptions	aaddfc62-6c65-40bc-b197-99e305da29de	nosniff
_browser_header.referrerPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	no-referrer
_browser_header.xRobotsTag	aaddfc62-6c65-40bc-b197-99e305da29de	none
_browser_header.xFrameOptions	aaddfc62-6c65-40bc-b197-99e305da29de	SAMEORIGIN
_browser_header.contentSecurityPolicy	aaddfc62-6c65-40bc-b197-99e305da29de	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.strictTransportSecurity	aaddfc62-6c65-40bc-b197-99e305da29de	max-age=31536000; includeSubDomains
bruteForceProtected	aaddfc62-6c65-40bc-b197-99e305da29de	false
permanentLockout	aaddfc62-6c65-40bc-b197-99e305da29de	false
maxTemporaryLockouts	aaddfc62-6c65-40bc-b197-99e305da29de	0
bruteForceStrategy	aaddfc62-6c65-40bc-b197-99e305da29de	MULTIPLE
maxFailureWaitSeconds	aaddfc62-6c65-40bc-b197-99e305da29de	900
minimumQuickLoginWaitSeconds	aaddfc62-6c65-40bc-b197-99e305da29de	60
waitIncrementSeconds	aaddfc62-6c65-40bc-b197-99e305da29de	60
quickLoginCheckMilliSeconds	aaddfc62-6c65-40bc-b197-99e305da29de	1000
maxDeltaTimeSeconds	aaddfc62-6c65-40bc-b197-99e305da29de	43200
failureFactor	aaddfc62-6c65-40bc-b197-99e305da29de	30
maxSecondaryAuthFailures	aaddfc62-6c65-40bc-b197-99e305da29de	0
realmReusableOtpCode	aaddfc62-6c65-40bc-b197-99e305da29de	false
displayNameHtml	aaddfc62-6c65-40bc-b197-99e305da29de	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	aaddfc62-6c65-40bc-b197-99e305da29de	RS256
offlineSessionMaxLifespanEnabled	aaddfc62-6c65-40bc-b197-99e305da29de	false
offlineSessionMaxLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	5184000
clientSessionIdleTimeout	aaddfc62-6c65-40bc-b197-99e305da29de	0
clientSessionMaxLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	0
clientOfflineSessionIdleTimeout	aaddfc62-6c65-40bc-b197-99e305da29de	0
clientOfflineSessionMaxLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	0
actionTokenGeneratedByAdminLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	43200
actionTokenGeneratedByUserLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	300
oauth2DeviceCodeLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	600
oauth2DevicePollingInterval	aaddfc62-6c65-40bc-b197-99e305da29de	5
organizationsEnabled	aaddfc62-6c65-40bc-b197-99e305da29de	false
scimApiEnabled	aaddfc62-6c65-40bc-b197-99e305da29de	false
adminPermissionsEnabled	aaddfc62-6c65-40bc-b197-99e305da29de	false
webAuthnPolicyRpEntityName	aaddfc62-6c65-40bc-b197-99e305da29de	keycloak
webAuthnPolicySignatureAlgorithms	aaddfc62-6c65-40bc-b197-99e305da29de	ES256,RS256
webAuthnPolicyRpId	aaddfc62-6c65-40bc-b197-99e305da29de	
webAuthnPolicyAttestationConveyancePreference	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyAuthenticatorAttachment	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyResidentKey	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyRequireResidentKey	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyUserVerificationRequirement	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyCreateTimeout	aaddfc62-6c65-40bc-b197-99e305da29de	0
webAuthnPolicyAvoidSameAuthenticatorRegister	aaddfc62-6c65-40bc-b197-99e305da29de	false
webAuthnPolicyRpEntityNamePasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	ES256,RS256
webAuthnPolicyRpIdPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	
webAuthnPolicyAttestationConveyancePreferencePasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyResidentKeyPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	required
webAuthnPolicyRequireResidentKeyPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	required
webAuthnPolicyCreateTimeoutPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	aaddfc62-6c65-40bc-b197-99e305da29de	false
cibaBackchannelTokenDeliveryMode	aaddfc62-6c65-40bc-b197-99e305da29de	poll
cibaExpiresIn	aaddfc62-6c65-40bc-b197-99e305da29de	120
cibaInterval	aaddfc62-6c65-40bc-b197-99e305da29de	5
cibaAuthRequestedUserHint	aaddfc62-6c65-40bc-b197-99e305da29de	login_hint
parRequestUriLifespan	aaddfc62-6c65-40bc-b197-99e305da29de	60
firstBrokerLoginFlowId	aaddfc62-6c65-40bc-b197-99e305da29de	b8f58e12-21d8-4929-8d86-336435f5f4a7
verifiableCredentialsEnabled	aaddfc62-6c65-40bc-b197-99e305da29de	false
client-policies.profiles	aaddfc62-6c65-40bc-b197-99e305da29de	{"profiles":[]}
client-policies.policies	aaddfc62-6c65-40bc-b197-99e305da29de	{"policies":[]}
_browser_header.contentSecurityPolicyReportOnly	0b379a43-608e-4ff3-aaf5-6106d6df4979	
_browser_header.xContentTypeOptions	0b379a43-608e-4ff3-aaf5-6106d6df4979	nosniff
_browser_header.referrerPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	no-referrer
_browser_header.xRobotsTag	0b379a43-608e-4ff3-aaf5-6106d6df4979	none
_browser_header.xFrameOptions	0b379a43-608e-4ff3-aaf5-6106d6df4979	SAMEORIGIN
_browser_header.contentSecurityPolicy	0b379a43-608e-4ff3-aaf5-6106d6df4979	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.strictTransportSecurity	0b379a43-608e-4ff3-aaf5-6106d6df4979	max-age=31536000; includeSubDomains
bruteForceProtected	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
permanentLockout	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
maxTemporaryLockouts	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
bruteForceStrategy	0b379a43-608e-4ff3-aaf5-6106d6df4979	MULTIPLE
maxFailureWaitSeconds	0b379a43-608e-4ff3-aaf5-6106d6df4979	900
minimumQuickLoginWaitSeconds	0b379a43-608e-4ff3-aaf5-6106d6df4979	60
waitIncrementSeconds	0b379a43-608e-4ff3-aaf5-6106d6df4979	60
quickLoginCheckMilliSeconds	0b379a43-608e-4ff3-aaf5-6106d6df4979	1000
maxDeltaTimeSeconds	0b379a43-608e-4ff3-aaf5-6106d6df4979	43200
failureFactor	0b379a43-608e-4ff3-aaf5-6106d6df4979	30
maxSecondaryAuthFailures	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
realmReusableOtpCode	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
defaultSignatureAlgorithm	0b379a43-608e-4ff3-aaf5-6106d6df4979	RS256
offlineSessionMaxLifespanEnabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
offlineSessionMaxLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	5184000
clientSessionIdleTimeout	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
clientSessionMaxLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
clientOfflineSessionIdleTimeout	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
clientOfflineSessionMaxLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
actionTokenGeneratedByAdminLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	43200
actionTokenGeneratedByUserLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	300
oauth2DeviceCodeLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	600
oauth2DevicePollingInterval	0b379a43-608e-4ff3-aaf5-6106d6df4979	5
organizationsEnabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
scimApiEnabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
adminPermissionsEnabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
webAuthnPolicyRpEntityName	0b379a43-608e-4ff3-aaf5-6106d6df4979	keycloak
webAuthnPolicySignatureAlgorithms	0b379a43-608e-4ff3-aaf5-6106d6df4979	ES256,RS256
webAuthnPolicyRpId	0b379a43-608e-4ff3-aaf5-6106d6df4979	
webAuthnPolicyAttestationConveyancePreference	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyAuthenticatorAttachment	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyResidentKey	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyRequireResidentKey	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyUserVerificationRequirement	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyCreateTimeout	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
webAuthnPolicyAvoidSameAuthenticatorRegister	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
webAuthnPolicyRpEntityNamePasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	ES256,RS256
webAuthnPolicyRpIdPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	
webAuthnPolicyAttestationConveyancePreferencePasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyResidentKeyPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	required
webAuthnPolicyRequireResidentKeyPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	required
webAuthnPolicyCreateTimeoutPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
cibaBackchannelTokenDeliveryMode	0b379a43-608e-4ff3-aaf5-6106d6df4979	poll
cibaExpiresIn	0b379a43-608e-4ff3-aaf5-6106d6df4979	120
cibaInterval	0b379a43-608e-4ff3-aaf5-6106d6df4979	5
cibaAuthRequestedUserHint	0b379a43-608e-4ff3-aaf5-6106d6df4979	login_hint
parRequestUriLifespan	0b379a43-608e-4ff3-aaf5-6106d6df4979	60
firstBrokerLoginFlowId	0b379a43-608e-4ff3-aaf5-6106d6df4979	9593e783-3df0-421d-8d7d-724813afbcf3
verifiableCredentialsEnabled	0b379a43-608e-4ff3-aaf5-6106d6df4979	false
client-policies.profiles	0b379a43-608e-4ff3-aaf5-6106d6df4979	{"profiles":[]}
client-policies.policies	0b379a43-608e-4ff3-aaf5-6106d6df4979	{"policies":[]}
darkMode	0b379a43-608e-4ff3-aaf5-6106d6df4979	true
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
aaddfc62-6c65-40bc-b197-99e305da29de	jboss-logging
0b379a43-608e-4ff3-aaf5-6106d6df4979	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	aaddfc62-6c65-40bc-b197-99e305da29de
password	password	t	t	0b379a43-608e-4ff3-aaf5-6106d6df4979
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
0b379a43-608e-4ff3-aaf5-6106d6df4979	de
0b379a43-608e-4ff3-aaf5-6106d6df4979	en
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.redirect_uris (client_id, value) FROM stdin;
b6749730-19c5-4539-b648-70b3d768d4a5	/realms/master/account/*
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	/realms/master/account/*
13d7c309-40a4-4da8-96e4-d38563094724	/admin/master/console/*
c2aa7767-dd0b-4caa-a965-8f251d7c4bd2	/realms/rag/account/*
af6f50f5-ba18-410b-9f03-544a93928f96	/realms/rag/account/*
ac96be9b-608d-46f9-9c11-35c6b36e70c7	http://localhost/api/auth/callback/keycloak
519682a7-2e80-40dd-b373-d40041557f9c	/admin/rag/console/*
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
ca0a22ae-102e-4e3e-ba3a-1ebad87c1ecf	TERMS_AND_CONDITIONS	Terms and Conditions	aaddfc62-6c65-40bc-b197-99e305da29de	f	f	TERMS_AND_CONDITIONS	20
77d2df4e-dfd5-4e36-bc0d-25ea4600a01b	UPDATE_PROFILE	Update Profile	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	UPDATE_PROFILE	40
d4663ee6-f2e6-4fda-b2b4-f634c560c7aa	VERIFY_EMAIL	Verify Email	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	VERIFY_EMAIL	50
86d1af61-371a-4a88-b0ca-cc8d162fd176	CONFIGURE_TOTP	Configure OTP	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	CONFIGURE_TOTP	54
51dc11c8-3b8b-470c-8f05-893970a571c2	UPDATE_PASSWORD	Update Password	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	UPDATE_PASSWORD	57
23b9cc17-2ac0-4451-b4b6-cc72fa7d8b3b	delete_account	Delete Account	aaddfc62-6c65-40bc-b197-99e305da29de	f	f	delete_account	60
101513fe-d55d-4a4d-b554-3e403905d12d	UPDATE_EMAIL	Update Email	aaddfc62-6c65-40bc-b197-99e305da29de	f	f	UPDATE_EMAIL	70
09e28fc9-0708-4391-af20-cb86013fc624	webauthn-register	Webauthn Register	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	webauthn-register	80
a4c7837b-4bcc-4778-8c0e-dd2d018aca68	webauthn-register-passwordless	Webauthn Register Passwordless	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	webauthn-register-passwordless	90
9ccf22f7-f074-4d1d-bf92-e1f33d670188	VERIFY_PROFILE	Verify Profile	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	VERIFY_PROFILE	100
78ef3077-b036-45f5-a17a-2c46fd4a6f78	delete_credential	Delete Credential	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	delete_credential	110
3130a448-d63c-4308-9f40-345068484f23	idp_link	Linking Identity Provider	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	idp_link	120
d5dff0e3-9c41-42d4-9097-bc07f5405399	CONFIGURE_RECOVERY_AUTHN_CODES	Recovery Authentication Codes	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	CONFIGURE_RECOVERY_AUTHN_CODES	130
d94c43be-d233-4d3d-8e1c-aab0e7218b97	update_user_locale	Update User Locale	aaddfc62-6c65-40bc-b197-99e305da29de	t	f	update_user_locale	1000
0c073600-31ee-4d5d-adf5-87a93cb35cc9	TERMS_AND_CONDITIONS	Terms and Conditions	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	f	TERMS_AND_CONDITIONS	20
b2230d42-b7ba-466d-9878-e622d676a059	UPDATE_PROFILE	Update Profile	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	UPDATE_PROFILE	40
84c40449-7a79-410a-9f50-2f4efbc2d371	VERIFY_EMAIL	Verify Email	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	VERIFY_EMAIL	50
0ee0f365-b0e2-45e1-906b-dadb44bde54c	CONFIGURE_TOTP	Configure OTP	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	CONFIGURE_TOTP	54
eb22392d-bdd2-45fb-9a06-26b03cbfaf34	UPDATE_PASSWORD	Update Password	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	UPDATE_PASSWORD	57
dedb6c26-8a6a-495a-b6d0-ea4394c22b3b	delete_account	Delete Account	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	f	delete_account	60
ae74c53f-a23c-4825-ad2b-c8e40ad801b1	UPDATE_EMAIL	Update Email	0b379a43-608e-4ff3-aaf5-6106d6df4979	f	f	UPDATE_EMAIL	70
8ac1c9e5-6f10-469c-8a52-5902dec49fbb	webauthn-register	Webauthn Register	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	webauthn-register	80
b7948e71-0105-46ee-8368-32972eebb462	webauthn-register-passwordless	Webauthn Register Passwordless	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	webauthn-register-passwordless	90
50cbdff3-cffb-442f-a25c-0715ed774b03	VERIFY_PROFILE	Verify Profile	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	VERIFY_PROFILE	100
3706dcd6-8b71-411c-8e0b-bf6e17c7bd66	delete_credential	Delete Credential	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	delete_credential	110
bc6a819b-f1be-48c0-90d7-662269c7d558	idp_link	Linking Identity Provider	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	idp_link	120
102e43ce-5cfa-4087-9c4b-8bfb293196ee	CONFIGURE_RECOVERY_AUTHN_CODES	Recovery Authentication Codes	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	CONFIGURE_RECOVERY_AUTHN_CODES	130
bee673cd-e9aa-45aa-a112-9541fb9e38a5	update_user_locale	Update User Locale	0b379a43-608e-4ff3-aaf5-6106d6df4979	t	f	update_user_locale	1000
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: revoked_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revoked_token (id, expire) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: root_auth_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.root_auth_session (id, realm_id, "timestamp", version) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	8f407941-5ffb-4ef6-baba-99911fecc1cb
c6b7bf90-1cf7-448b-a3f3-8bcbba8824ab	4728feef-9227-42df-bed4-e616e19019dd
af6f50f5-ba18-410b-9f03-544a93928f96	db35a8da-587a-4a58-bd44-98f6275b766d
af6f50f5-ba18-410b-9f03-544a93928f96	51d714c1-b2cd-4666-ab37-a38531b80792
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: server_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.server_config (server_config_key, value, version) FROM stdin;
\.


--
-- Data for Name: single_use_object; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.single_use_object (id, notes, expire) FROM stdin;
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_attribute (name, value, user_id, id, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
is_temporary_admin	true	aca176e6-cfd9-4170-8526-fbb9e338cf60	bd211aa7-2ad9-439c-9b70-04c71d6efed3	\N	\N	\N
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_consent_client_scope (user_consent_id, scope_id, parameter) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before, last_modified_timestamp) FROM stdin;
aca176e6-cfd9-4170-8526-fbb9e338cf60	\N	943d7680-1424-4b70-ab57-682e0f558c10	f	t	\N	\N	\N	aaddfc62-6c65-40bc-b197-99e305da29de	admin	1787828841251	\N	0	1788533828801
9aa1989a-4b86-40f0-93cb-e7785853b7ac	max1234@test.de	max1234@test.de	t	t	\N	Max	Mustermann	0b379a43-608e-4ff3-aaf5-6106d6df4979	max1234	1788570865733	\N	0	1788570865733
3f89d314-1121-4537-a949-f0146ef8fdcd	hakan@test.de	hakan@test.de	t	t	\N	Hakan	Orhan	0b379a43-608e-4ff3-aaf5-6106d6df4979	hakan1089	1788795416620	\N	0	1788795416620
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_group_membership (group_id, user_id, membership_type) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
9c5f03fd-ddf6-4549-b4e7-0c126eecf1e2	aca176e6-cfd9-4170-8526-fbb9e338cf60
ba3d789a-ee0c-49f2-abe4-b0a08e73fd83	aca176e6-cfd9-4170-8526-fbb9e338cf60
9a4e149d-6038-4d4e-8187-5f862769e293	9aa1989a-4b86-40f0-93cb-e7785853b7ac
5fe8cd92-128f-4bb6-beb6-c0908f026060	9aa1989a-4b86-40f0-93cb-e7785853b7ac
9a4e149d-6038-4d4e-8187-5f862769e293	3f89d314-1121-4537-a949-f0146ef8fdcd
d31b0beb-3510-491d-8595-c30241ff4e7a	3f89d314-1121-4537-a949-f0146ef8fdcd
\.


--
-- Data for Name: user_ver_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_ver_credential (id, client_scope_id, user_id, revision, created_date, updated_date, user_attributes, version) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.web_origins (client_id, value) FROM stdin;
13d7c309-40a4-4da8-96e4-d38563094724	+
ac96be9b-608d-46f9-9c11-35c6b36e70c7	http://localhost
519682a7-2e80-40dd-b373-d40041557f9c	+
\.


--
-- Data for Name: workflow_state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workflow_state (execution_id, resource_id, workflow_id, resource_type, scheduled_step_id, scheduled_step_timestamp) FROM stdin;
\.


--
-- Name: org_domain ORG_DOMAIN_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org_domain
    ADD CONSTRAINT "ORG_DOMAIN_pkey" PRIMARY KEY (id, name);


--
-- Name: org ORG_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "ORG_pkey" PRIMARY KEY (id);


--
-- Name: server_config SERVER_CONFIG_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.server_config
    ADD CONSTRAINT "SERVER_CONFIG_pkey" PRIMARY KEY (server_config_key);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id, parameter);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id, parameter);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: jgroups_ping constraint_jgroups_ping; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jgroups_ping
    ADD CONSTRAINT constraint_jgroups_ping PRIMARY KEY (address);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: org_invitation constraint_org_invitation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT constraint_org_invitation PRIMARY KEY (id);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: revoked_token constraint_rt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revoked_token
    ADD CONSTRAINT constraint_rt PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_ver_credential constraint_vcred_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ver_credential
    ADD CONSTRAINT constraint_vcred_pm PRIMARY KEY (id);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: auth_session pk_auth_session; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_session
    ADD CONSTRAINT pk_auth_session PRIMARY KEY (root_auth_session_id, tab_id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: cluster_event pk_cluster_event; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cluster_event
    ADD CONSTRAINT pk_cluster_event PRIMARY KEY (id, target_cluster);


--
-- Name: fed_issued_ver_credential pk_fed_issued_ver_credential; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_issued_ver_credential
    ADD CONSTRAINT pk_fed_issued_ver_credential PRIMARY KEY (id);


--
-- Name: fed_user_ver_credential pk_fed_user_ver_credential; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_ver_credential
    ADD CONSTRAINT pk_fed_user_ver_credential PRIMARY KEY (id);


--
-- Name: issued_ver_credential pk_issued_ver_credential; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issued_ver_credential
    ADD CONSTRAINT pk_issued_ver_credential PRIMARY KEY (id);


--
-- Name: login_failure pk_login_failure; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_failure
    ADD CONSTRAINT pk_login_failure PRIMARY KEY (realm_id, user_id);


--
-- Name: outbox_entry pk_outbox_entry; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outbox_entry
    ADD CONSTRAINT pk_outbox_entry PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: root_auth_session pk_root_auth_session; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.root_auth_session
    ADD CONSTRAINT pk_root_auth_session PRIMARY KEY (id);


--
-- Name: single_use_object pk_single_use_object; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.single_use_object
    ADD CONSTRAINT pk_single_use_object PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: workflow_state pk_workflow_state; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT pk_workflow_state PRIMARY KEY (execution_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: outbox_entry uc_outbox_kind_owner_correlation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outbox_entry
    ADD CONSTRAINT uc_outbox_kind_owner_correlation UNIQUE (entry_kind, owner_id, correlation_id);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: user_consent uk_external_consent; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_external_consent UNIQUE (client_storage_provider, external_client_id, user_id);


--
-- Name: fed_user_ver_credential uk_fed_user_vc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_ver_credential
    ADD CONSTRAINT uk_fed_user_vc UNIQUE (user_id, client_scope_id);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_ver_credential uk_kkuwuvd67ontgsugogm8uewre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ver_credential
    ADD CONSTRAINT uk_kkuwuvd67ontgsugogm8uewre UNIQUE (user_id, client_scope_id);


--
-- Name: user_consent uk_local_consent; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_local_consent UNIQUE (client_id, user_id);


--
-- Name: migration_model uk_migration_update_time; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_update_time UNIQUE (update_time);


--
-- Name: migration_model uk_migration_version; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_version UNIQUE (version);


--
-- Name: org uk_org_alias; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_alias UNIQUE (realm_id, alias);


--
-- Name: org uk_org_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_group UNIQUE (group_id);


--
-- Name: org_invitation uk_org_invitation_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT uk_org_invitation_email UNIQUE (organization_id, email);


--
-- Name: org uk_org_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_name UNIQUE (realm_id, name);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: workflow_state uq_workflow_resource; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT uq_workflow_resource UNIQUE (workflow_id, resource_id);


--
-- Name: fed_user_attr_long_values; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fed_user_attr_long_values ON public.fed_user_attribute USING btree (long_value_hash, name);


--
-- Name: fed_user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fed_user_attr_long_values_lower_case ON public.fed_user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_broker_link_identity_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_broker_link_identity_provider ON public.broker_link USING btree (realm_id, identity_provider, broker_user_id);


--
-- Name: idx_broker_link_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_broker_link_user_id ON public.broker_link USING btree (user_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, substr(value, 1, 255));


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_cluster_event_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cluster_event_target ON public.cluster_event USING btree (target_cluster, created_at);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_entity_user_id_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_event_entity_user_id_type ON public.event_entity USING btree (user_id, type, event_time);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fed_issued_vc_cred_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fed_issued_vc_cred_id ON public.fed_issued_ver_credential USING btree (ver_credential_id);


--
-- Name: idx_fed_issued_vc_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fed_issued_vc_expires ON public.fed_issued_ver_credential USING btree (expires_at);


--
-- Name: idx_fed_issued_vc_storage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fed_issued_vc_storage ON public.fed_issued_ver_credential USING btree (storage_provider_id);


--
-- Name: idx_fed_issued_vc_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fed_issued_vc_user ON public.fed_issued_ver_credential USING btree (user_id, realm_id, issued_at);


--
-- Name: idx_fed_user_vc_realm_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fed_user_vc_realm_user ON public.fed_user_ver_credential USING btree (realm_id, user_id);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_org_id ON public.keycloak_group USING btree (org_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_idp_for_login; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_idp_for_login ON public.identity_provider USING btree (realm_id, enabled, link_only, hide_on_login, organization_id);


--
-- Name: idx_idp_realm_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_idp_realm_org ON public.identity_provider USING btree (realm_id, organization_id);


--
-- Name: idx_issued_ver_credential_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issued_ver_credential_expires_at ON public.issued_ver_credential USING btree (expires_at);


--
-- Name: idx_issued_ver_credential_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issued_ver_credential_user ON public.issued_ver_credential USING btree (user_id, issued_at);


--
-- Name: idx_issued_ver_credential_vc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issued_ver_credential_vc ON public.issued_ver_credential USING btree (ver_credential_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_login_failure_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_failure_expire ON public.login_failure USING btree (last_failure);


--
-- Name: idx_offline_css_by_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_css_by_client ON public.offline_client_session USING btree (client_id, offline_flag) WHERE ((client_id)::text <> 'external'::text);


--
-- Name: idx_offline_css_by_client_and_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_css_by_client_and_realm ON public.offline_client_session USING btree (realm_id, offline_flag, client_id, client_storage_provider, external_client_id);


--
-- Name: idx_offline_css_by_client_storage_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_css_by_client_storage_provider ON public.offline_client_session USING btree (client_storage_provider, external_client_id, offline_flag) WHERE ((client_storage_provider)::text <> 'internal'::text);


--
-- Name: idx_offline_css_by_user_session_and_offline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_css_by_user_session_and_offline ON public.offline_client_session USING btree (offline_flag, user_session_id);


--
-- Name: idx_offline_uss_by_broker_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_by_broker_session_id ON public.offline_user_session USING btree (broker_session_id, realm_id);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_org_domain_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_domain_org_id ON public.org_domain USING btree (org_id);


--
-- Name: idx_org_invitation_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_invitation_email ON public.org_invitation USING btree (email);


--
-- Name: idx_org_invitation_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_invitation_expires ON public.org_invitation USING btree (expires_at);


--
-- Name: idx_org_invitation_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_invitation_org_id ON public.org_invitation USING btree (organization_id);


--
-- Name: idx_outbox_container; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_outbox_container ON public.outbox_entry USING btree (entry_kind, owner_id, container_id);


--
-- Name: idx_outbox_drain; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_outbox_drain ON public.outbox_entry USING btree (entry_kind, status, next_attempt_at);


--
-- Name: idx_outbox_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_outbox_owner ON public.outbox_entry USING btree (entry_kind, owner_id, status);


--
-- Name: idx_outbox_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_outbox_realm ON public.outbox_entry USING btree (entry_kind, realm_id, status);


--
-- Name: idx_perm_ticket_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perm_ticket_owner ON public.resource_server_perm_ticket USING btree (owner);


--
-- Name: idx_perm_ticket_requester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perm_ticket_requester ON public.resource_server_perm_ticket USING btree (requester);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_rev_token_on_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rev_token_on_expire ON public.revoked_token USING btree (expire);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_root_auth_session_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_root_auth_session_realm ON public.root_auth_session USING btree (realm_id, "timestamp");


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_single_use_obj_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_single_use_obj_expire ON public.single_use_object USING btree (expire);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_usconsent_scope_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usconsent_scope_id ON public.user_consent_client_scope USING btree (scope_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_created_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_created_timestamp ON public.user_entity USING btree (realm_id, created_timestamp);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_user_session_expiration_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_session_expiration_created ON public.offline_user_session USING btree (realm_id, offline_flag, remember_me, created_on, user_session_id, user_id);


--
-- Name: idx_user_session_expiration_last_refresh; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_session_expiration_last_refresh ON public.offline_user_session USING btree (realm_id, offline_flag, remember_me, last_session_refresh, user_session_id, user_id);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: idx_workflow_state_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workflow_state_provider ON public.workflow_state USING btree (resource_id);


--
-- Name: idx_workflow_state_step; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workflow_state_step ON public.workflow_state USING btree (workflow_id, scheduled_step_id);


--
-- Name: user_attr_long_values; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_attr_long_values ON public.user_attribute USING btree (long_value_hash, name);


--
-- Name: user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_attr_long_values_lower_case ON public.user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: auth_session fk_auth_session_root; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_session
    ADD CONSTRAINT fk_auth_session_root FOREIGN KEY (root_auth_session_id) REFERENCES public.root_auth_session(id) ON DELETE CASCADE;


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: fed_issued_ver_credential fk_fed_issued_vc_ver_cred; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_issued_ver_credential
    ADD CONSTRAINT fk_fed_issued_vc_ver_cred FOREIGN KEY (ver_credential_id) REFERENCES public.fed_user_ver_credential(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: keycloak_group fk_group_organization; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT fk_group_organization FOREIGN KEY (org_id) REFERENCES public.org(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: issued_ver_credential fk_issued_ver_credential_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issued_ver_credential
    ADD CONSTRAINT fk_issued_ver_credential_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: issued_ver_credential fk_issued_ver_credential_vc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issued_ver_credential
    ADD CONSTRAINT fk_issued_ver_credential_vc FOREIGN KEY (ver_credential_id) REFERENCES public.user_ver_credential(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: org_invitation fk_org_invitation_org; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT fk_org_invitation_org FOREIGN KEY (organization_id) REFERENCES public.org(id) ON DELETE CASCADE;


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_ver_credential fk_vcred_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ver_credential
    ADD CONSTRAINT fk_vcred_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1fqGeaHvNHjDRz0DeDGddwOWgHruoWcFNuRcLczB6zM6hQURJ6zB6IapdMxoJ95

