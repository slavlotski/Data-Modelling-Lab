**Relational data model** - is a way to organize your data in a database via tables. The data becomes structured (easy to manipulate:  delete, update, insert), flexible (we can connect every object with each other, setting up relations between them) and understandable (everyone knows how a table looks like).

Every table represents an object from the business model; its columns describe the business attributes of that object and every row is an instance of it.

Example:
| chat                | message                                  | attachment   |
|---------------------|------------------------------------------|--------------|
| King Arthur         | Hello, Sam! How are you doing today?     | photo.jpg    |
| Harry Potter        | Meet me at Hogwarts at midnight.         | map.pdf      |
| Lord of the Rings   | The road goes ever on and on.            | scroll.png   |

The core properties:
- Every row have the same structure
- Every row is a unique instance of the object
- Every value in a column have the same data type
