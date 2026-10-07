# Security Policy

## Reporting Vulnerabilities

If you discover a potential vulnerability in `@estamora/sdk`, please report it privately through GitHub Security Advisories.

## Security Practices

- The SDK signs transactions only when delegated via approved wallet extensions (Freighter) or explicitly provided keypairs.
- Private keys must never be transmitted over RPC or logged to stdout.
- Pre-flight simulation acts as an extra layer of defense against accidental over-spending and out-of-gas errors.
