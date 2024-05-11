# recips server 

> [!NOTE]
> change **<http://localhost:5000/>** to your **process.env.PORT**

## users resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/users/signin](http://localhost:5000/users/signin) | POST | user sign in | - |  - | - |email, password | - | the user | 200 - succeed, 401 - auth failed |||||||
| [http://localhost:5000/users/signup](http://localhost:5000/users/signup) | POST | user sign up | - |||||||
| [http://localhost:5000/users/](http://localhost:5000/users/:id)| GET | get all users  | admin |||||||

## recipes resource

| url | method | description | permissions | parameters | optional parameters | body | headers | returns | status codes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [http://localhost:5000/recipes](http://localhost:5000/recipes) | GET | get all recipes | --- |||||||
| [http://localhost:5000/recipes](http://localhost:5000/recipes/with-users) | GET | get full data of all recipes (recipes with registered users data) | --- |||||||
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | GET | get recipes by *id* | --- |||||||
| [http://localhost:5000/recipes](http://localhost:5000/recipes) | POST | add new recipes | administrator |||||||
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | PUT | update existing recipes (by *id*) | --- |||||||
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | DELETE | delete existing course (by *id*) | --- |||||||
