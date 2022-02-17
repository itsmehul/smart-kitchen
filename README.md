Tasks

- check subrecipe inventory first, then take the ingredients from the subrecipe








- before a forecast is set all modifications are done on the inKitchen cell
after a forecast is set all modifications are done on the remainingQty cell


- mono packages won't have qr code so makes no sense to track orders with that instead its better to keep track of the bowls for washing and such

- winston logger

- dynamo db



Login System?
Use cases

Server (BE)
to create order
soln: api key, ip lock

(Although IAM can handle the system from within AWS, if the client is outside of AWS this isn't practical)

Browser (FE)
soln: jwt w expiry, ip lock

QR FLOW

Scan the bowl on the completed lane and associate it to a recipe
Scan the bowl before packing to associate the bowl (wrt recipe) to a given order in the box

Additional:
How do we make sure the dish is actually completed and there was no human error in lane movement?
Eg: we have only completed 40/30 but we've set completed to 40.
The bowl system scans the dishes to move them from inKitchen to inCompleted, at this point you are not allowed to shift the dishes manually but only via scanning. (Rescan to change recipe)


The kitchen cutoff is at 945 after which boxing starts, for all orders(regardless of their status in the lane, this is possible since lane has no association with orders and its only needeed to keep track of the dishes made)






TYPEORM TESTS

Calling w relation condtion - 3.8, 2.8, 2.5
Calling wo condition - 3.1,2.8
Calling w joins -3.7,3.4,3.7

The above tried with 7000 records

limiting the return to 1500 records 
Calling w relation condtion & joins 480ms

The orm has handle multiple requests at once.
Long running create order + simple fetches, simultaneously





Gains
Module isolation for module replacement and easier management w dependency injection
Keeping kitchen services seperate
- cleaner code (mixing concerns)
- cleaner data
- no duplication of code
- can use as sass 
- easier to maintain and scale
typeorm all fronts
transactions
UTC timing all across
Station management
Inventory management
- expiry
- batch system
- storage management
- supplier management
- cost management based on current price of batch
Inheritance
- cost
- calories
- nutrition
- weight
Multikitchen
Forecasting system tied into lane mechanics
Fast lane movement
Fast box packing 
Dynamic jobs
Seperated Delivery Service
Luxon for time management
Easy socket integration w subscriptions
- Stock update
- Order status update
Nested instructions and steps
Steps have relationship w action/ingredient/subrecipe (dynamic names)
Steps have yield logic which should affect price, nutrition, calories
SMS, AWS, MEDIA, EMAIL
Auth
- Roles, multiple roles
- JWT
- Client(s) & Staff seperation for sass use
Graphql/REST integration
Auto documentation
Auto validation
MenuItem which will store the serialNo of the recipe for that menu
Bowl management
- QR code support
Bow management
- best fit model
- dynamic box sizes
- view box availability
- view box status
Removed bloat
Simpler/ Readable/ Maintainable apis
Integrated testing support
Env variable management
