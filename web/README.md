# fubuu-web

Configuration:

```yaml
!!python/object:shadowstone_cli.models.config.Component
details:
  port: '3000'
  framework: react
```

```
npm run stripe:listen
```

```
stripe fixtures src/app/(billing)/_utils/stripe-fixtures.json --api-key <STRIPE_KEY(sk_test_)>
```

If the above doesn't work (in some shells due to parenthesis), escape them with below

```
stripe fixtures src/app/\(billing\)/_utils/stripe-fixtures.json --api-key <STRIPE_KEY(sk_test_)>
```

### ORM

npm i drizzle-orm
npm i -D drizzle-kit
npm i @neondatabase/serverless
npm i dotenv
