## app.use(express.json())
```
“Whenever the client sends JSON data in the request body, convert that JSON into a JavaScript object so I can use it.”

```

## MongoDb Atlas
```
instead of running mongodb in my computer it run  it in cloud server 
```

jG28YVvCissJgOWF

mongodb+srv://<db_username>:jG28YVvCissJgOWF@userdata.hdugkd0.mongodb.net/
## import crypto from "crypto";
```
for storing pasword in # format
```

## createHash("sha256")

```
default hash function
```

## how findOne() work in model?
```
userModel.findOne()
       ↓
Mongoose sends query to MongoDB
       ↓
MongoDB searches "users" collection
       ↓
Finds matching document
       ↓
MongoDB sends it back
       ↓
user receives that document

```


```
POST /api/auth/register
        ↓
app.js
        ↓
app.use("/api/auth", authRouter)
        ↓
authRouter
        ↓
authRouter.post("/register", register)
        ↓
register controller
```

## how user-b's jwt is choosen ?
```
User B sends request
       ↓
HTTP request contains B's Authorization header
       ↓
Express puts that request into req
       ↓
req.headers.authorization
       ↓
you extract B's JWT
       ↓
jwt.verify() checks the JWT
       ↓
decoded.id identifies B
```

## Refresh Token
```
“A refresh token is commonly stored in an HttpOnly cookie. Because the cookie is HttpOnly, it cannot be accessed by client-side JavaScript, which helps protect it from token theft through XSS. When the access token expires or the page is refreshed, the frontend sends a request to the refresh endpoint. The browser automatically includes the HttpOnly cookie with that request. The server reads and validates the refresh token, and if it is valid, issues a new access token.”
```

## meaning of data database link we created in atlas
```
userdata:userdata123 → MongoDB username and password
This is the Database Access user you created in MongoDB Atlas.
```

```
userdata.hdugkd0.mongodb.net → your Atlas cluster

This tells MongoDB which Atlas cluster to connect to.
```
```
/auth-users → database name

```

### jwt verify token
```
Checks the signature
→ Was this token created using your secret?
Checks expiration
→ Is the token still valid, or has it expired?
Returns the payload if everything is valid.
```

### ref:"users"
```
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user is required"],
}

This ObjectId belongs to a document in the users collection/model.
For example, suppose you have a users collection:

users
 ├── _id: 101 → Anirban
 ├── _id: 102 → Rahul
 └── _id: 103 → John

And another collection, say orders:

{
    user: 101,
    product: "Laptop"
}

Here:

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
}

means:

orders.user
    ↓
contains the _id of
    ↓
users collection
Why is ref useful?

It allows you to use Mongoose's populate():
```

## timestamps:true
```
timestamps: true is a Mongoose option that automatically adds two fields to every document:
createdAt->when the session was created.
updatedAt->when the session was last updated.
```

## device deviation
```
If the laptop and phone open the same website URL, their data is still kept separately on each device, while the backend/database keeps the actual account/session data centrally.
```

### why we need to create credential during using nodemailer ?
```
Because Nodemailer needs permission to use an email account to send emails.

Think of Nodemailer as a mailman. It can deliver the email, but it needs to know:

"Which email account am I allowed to send this email from?"

That's what the credentials provide.
```