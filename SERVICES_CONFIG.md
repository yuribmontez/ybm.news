# Services

## Stripe

After creating your account, create a product "subscription" with name & value.

---

## FaunaDB

- Crate a new database on [FaunaDB](https://dashboard.fauna.com)

- After creating your database, you'll need to create some Collections and Indexes. Follow the template bellow:


### **Collections**

```js
  {
    name: "subscriptions",
    history_days: 30,
    ttl_days: null
  }

  {
    name: "users",
    history_days: 30,
    ttl_days: null
  }
```

### **Indexes**

```js
  {
    name: "subscription-by-id",
    unique: false,
    serialized: true,
    source: "subscriptions",
    terms: [
      {
        field: ["data", "id"]
      }
    ]
  }

  {
    name: "subscription-by-status",
    unique: false,
    serialized: true,
    source: "subscriptions",
    terms: [
      {
        field: ["data", "status"]
      }
    ]
  }

  {
    name: "subscription-by-user_ref",
    unique: false,
    serialized: true,
    source: "subscriptions",
    terms: [
      {
        field: ["data", "userId"]
      }
    ]
  }

  {
    name: "user-by-email",
    unique: true,
    serialized: true,
    source: "users",
    terms: [
      {
        field: ["data", "email"]
      }
    ]
  }

  {
    name: "user-by-stripe-customer-id",
    unique: false,
    serialized: true,
    source: "users",
    terms: [
      {
        field: ["data", "stripe_customer_id"]
      }
    ]
  }
```

---

## Prismic CMS
```
 Create a new Prismic repository and add a custom type following the template bellow:
```
- Type: Repeatable Type

- Name: post

Fields:

 - UID
 - Title as h1
 - RichText allowing multiple paragraphs and target _blank for links

```
You'll be able to create new posts on the "Documents" tab
```
