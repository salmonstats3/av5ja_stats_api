ALTER SYSTEM SET max_connections TO '500';
-- ALTER SYSTEM SET synchronous_commit TO 'OFF';
ALTER SYSTEM SET client_encoding TO 'UTF8';
ALTER SYSTEM SET statement_timeout TO '300min';
ALTER SYSTEM SET max_standby_archive_delay TO '60000';
ALTER SYSTEM SET max_standby_streaming_delay TO '60000';
ALTER SYSTEM SET shared_buffers TO '1048576';
ALTER SYSTEM SET max_wal_size TO '8192MB'