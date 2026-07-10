import { applyLessonVideoLinks } from "../../shared/applyLessonVideoLinks";
import { SQL_VIDEO_LINKS } from "./sqlVideoLinks";

const ACCENT = "#3b82f6"; // A nice blue for SQL

function quiz(question, options, answer, explanation) {
  return { type: "quiz", question, options, answer, explanation };
}

function callout(variant, content) {
  return { type: "callout", variant, content };
}

function text(content, codeBlock = null) {
  if (codeBlock) {
    return {
      type: "text",
      content,
      code: { lang: "sql", ...codeBlock },
    };
  }
  return { type: "text", content };
}

export const SQL_CHAPTERS = [
  {
    id: "fundamentals",
    title: "SQL Fundamentals",
    icon: "🗄️",
    color: ACCENT,
    lessons: [
      {
        id: "sql-fund-1",
        title: "What is SQL?",
        xp: 10,
        theory: [
          text("SQL (Structured Query Language) is the standard language used to communicate with Relational Database Management Systems (RDBMS)."),
          callout("info", "Common databases that use SQL include MySQL, PostgreSQL, SQL Server, and SQLite."),
          quiz("What does SQL stand for?", ["Simple Query Language", "Structured Query Language", "Server Query Logic", "Sequential Query Logic"], 1, "SQL stands for Structured Query Language.")
        ],
        challenge: {
          title: "Introduction",
          description: "Just run the editor to pass this introductory lesson.",
          instructions: ["Click Run to continue."],
          defaultCode: "-- Ready to learn SQL\n",
          tests: [
            { id: "test1", description: "Completed introduction", regex: /.*/ }
          ]
        }
      },
      {
        id: "sql-fund-2",
        title: "Tables and Databases",
        xp: 15,
        theory: [
          text("A database contains one or more tables. Each table is identified by a name (e.g., `Customers` or `Orders`) and contains records (rows) with data.")
        ],
        challenge: {
          title: "Database concepts",
          description: "Write a comment stating what contains rows and columns.",
          instructions: ["Write `-- A table` in the editor."],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Wrote comment", regex: /-- A table/i }
          ]
        }
      }
    ]
  },
  {
    id: "queries",
    title: "SQL Queries",
    icon: "🔍",
    color: ACCENT,
    lessons: [
      {
        id: "sql-q-1",
        title: "The SELECT Statement",
        xp: 20,
        theory: [
          text("The `SELECT` statement is used to select data from a database.", { label: "Select all columns", content: "SELECT * FROM Users;" }),
          text("You can also select specific columns:", { label: "Select specific columns", content: "SELECT firstName, lastName FROM Users;" })
        ],
        challenge: {
          title: "Select Data",
          description: "Write a query to select `name` and `age` from the `students` table.",
          instructions: ["Use SELECT and FROM."],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses SELECT", regex: /SELECT/i, errorMessage: "Use SELECT" },
            { id: "test2", description: "Selects correct columns", regex: /name\s*,\s*age/i, errorMessage: "Select name and age" },
            { id: "test3", description: "Uses FROM students", regex: /FROM\s+students/i, errorMessage: "Select from the students table" }
          ]
        }
      },
      {
        id: "sql-q-2",
        title: "The WHERE Clause",
        xp: 20,
        theory: [
          text("The `WHERE` clause is used to filter records.", { label: "Filter example", content: "SELECT * FROM Users WHERE age > 18;" })
        ],
        challenge: {
          title: "Filter Data",
          description: "Select everything from `employees` where `salary` is greater than 50000.",
          instructions: ["Use WHERE salary > 50000"],
          defaultCode: "SELECT * FROM employees\n",
          tests: [
            { id: "test1", description: "Uses WHERE clause", regex: /WHERE\s+salary\s*>\s*50000/i, errorMessage: "Add a WHERE clause for salary > 50000" }
          ]
        }
      }
    ]
  },
  {
    id: "joins",
    title: "SQL Joins",
    icon: "🔗",
    color: ACCENT,
    lessons: [
      {
        id: "sql-j-1",
        title: "INNER JOIN",
        xp: 30,
        theory: [
          text("A `JOIN` clause is used to combine rows from two or more tables, based on a related column between them."),
          text("`INNER JOIN` returns records that have matching values in both tables.", { label: "Inner Join", content: "SELECT Orders.OrderID, Customers.CustomerName\nFROM Orders\nINNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;" })
        ],
        challenge: {
          title: "Write an INNER JOIN",
          description: "Join `users` and `orders` on `users.id = orders.user_id`.",
          instructions: ["Use INNER JOIN and ON."],
          defaultCode: "SELECT users.name, orders.amount\nFROM users\n",
          tests: [
            { id: "test1", description: "Uses INNER JOIN", regex: /INNER\s+JOIN\s+orders/i, errorMessage: "Use INNER JOIN orders" },
            { id: "test2", description: "Uses ON condition", regex: /ON\s+users\.id\s*=\s*orders\.user_id/i, errorMessage: "Check your ON condition" }
          ]
        }
      }
    ]
  },
  {
    id: "aggregate",
    title: "SQL Aggregate Functions",
    icon: "📊",
    color: ACCENT,
    lessons: [
      {
        id: "sql-agg-1",
        title: "COUNT, SUM, AVG",
        xp: 25,
        theory: [
          text("Aggregate functions perform a calculation on a set of values, and return a single value."),
          callout("info", "`COUNT()` returns the number of rows. `SUM()` returns the total sum. `AVG()` returns the average.")
        ],
        challenge: {
          title: "Count rows",
          description: "Count the total number of products in the `products` table.",
          instructions: ["Use SELECT COUNT(*) FROM products"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses COUNT", regex: /COUNT\(\*\)/i, errorMessage: "Use COUNT(*)" }
          ]
        }
      },
      {
        id: "sql-agg-2",
        title: "GROUP BY",
        xp: 30,
        theory: [
          text("The `GROUP BY` statement groups rows that have the same values into summary rows.", { label: "Group By example", content: "SELECT Country, COUNT(CustomerID)\nFROM Customers\nGROUP BY Country;" })
        ],
        challenge: {
          title: "Group Data",
          description: "Select `department` and `COUNT(*)` from `employees` grouped by `department`.",
          instructions: ["Use GROUP BY department"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses GROUP BY", regex: /GROUP\s+BY\s+department/i, errorMessage: "Group by department" }
          ]
        }
      }
    ]
  },
  {
    id: "subqueries",
    title: "SQL Subqueries",
    icon: "📥",
    color: ACCENT,
    lessons: [
      {
        id: "sql-sub-1",
        title: "Basic Subqueries",
        xp: 35,
        theory: [
          text("A subquery is a query nested inside another query.", { label: "Subquery example", content: "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);" })
        ],
        challenge: {
          title: "Write a Subquery",
          description: "Select all from `products` where `price` is greater than the average price of all products.",
          instructions: ["Use a subquery in the WHERE clause."],
          defaultCode: "SELECT * FROM products\nWHERE price > (\n  -- write subquery here\n);",
          tests: [
            { id: "test1", description: "Uses subquery", regex: /SELECT\s+AVG\(price\)\s+FROM\s+products/i, errorMessage: "Your subquery should select the AVG(price) from products." }
          ]
        }
      }
    ]
  },
  {
    id: "views",
    title: "SQL Views",
    icon: "👁️",
    color: ACCENT,
    lessons: [
      {
        id: "sql-view-1",
        title: "Creating Views",
        xp: 30,
        theory: [
          text("In SQL, a view is a virtual table based on the result-set of an SQL statement.", { label: "Create View", content: "CREATE VIEW Brazil_Customers AS\nSELECT CustomerName, ContactName\nFROM Customers\nWHERE Country = 'Brazil';" })
        ],
        challenge: {
          title: "Create a View",
          description: "Create a view named `active_users` that selects all users where `status = 'active'`.",
          instructions: ["Use CREATE VIEW active_users AS"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Creates view", regex: /CREATE\s+VIEW\s+active_users\s+AS/i, errorMessage: "Use CREATE VIEW active_users AS" },
            { id: "test2", description: "Selects active users", regex: /WHERE\s+status\s*=\s*'active'/i, errorMessage: "Filter by status = 'active'" }
          ]
        }
      }
    ]
  },
  {
    id: "indexes",
    title: "SQL Indexes",
    icon: "⚡",
    color: ACCENT,
    lessons: [
      {
        id: "sql-idx-1",
        title: "Creating Indexes",
        xp: 30,
        theory: [
          text("Indexes are used to retrieve data from the database more quickly than otherwise. The users cannot see the indexes, they are just used to speed up searches/queries."),
          text("Note: Updating a table with indexes takes more time than updating a table without.", { label: "Create Index", content: "CREATE INDEX idx_lastname\nON Persons (LastName);" })
        ],
        challenge: {
          title: "Index a column",
          description: "Create an index named `idx_email` on the `email` column of the `users` table.",
          instructions: ["Use CREATE INDEX idx_email ON users (email);"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Creates index", regex: /CREATE\s+INDEX\s+idx_email\s+ON\s+users\s*\(\s*email\s*\)/i, errorMessage: "Check syntax for creating an index." }
          ]
        }
      }
    ]
  },
  {
    id: "procedures",
    title: "SQL Stored Procedures",
    icon: "📜",
    color: ACCENT,
    lessons: [
      {
        id: "sql-sp-1",
        title: "Basic Procedures",
        xp: 40,
        theory: [
          text("A stored procedure is a prepared SQL code that you can save, so the code can be reused over and over again.", { label: "Create Procedure", content: "CREATE PROCEDURE SelectAllCustomers\nAS\nSELECT * FROM Customers\nGO;" })
        ],
        challenge: {
          title: "Call a Procedure",
          description: "Execute a stored procedure named `GetActiveUsers`.",
          instructions: ["Use the EXEC or EXECUTE command depending on SQL flavor. Let's use `EXEC GetActiveUsers;`"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Calls procedure", regex: /EXEC\s+GetActiveUsers/i, errorMessage: "Use EXEC GetActiveUsers" }
          ]
        }
      }
    ]
  },
  {
    id: "projects",
    title: "SQL Projects",
    icon: "🚀",
    color: ACCENT,
    lessons: [
      {
        id: "sql-proj-1",
        title: "Library Management",
        xp: 100,
        theory: [
          text("Time to put everything together. You will write queries to manage a library database.")
        ],
        challenge: {
          title: "Find Overdue Books",
          description: "Write a query that joins `loans`, `books`, and `members` to find the `books.title` and `members.name` where `loans.return_date` is less than '2026-01-01'.",
          instructions: ["Join the three tables", "Select title and name", "Filter by return_date < '2026-01-01'"],
          defaultCode: "SELECT books.title, members.name\nFROM loans\n",
          tests: [
            { id: "test1", description: "Joins books", regex: /JOIN\s+books/i, errorMessage: "Join the books table" },
            { id: "test2", description: "Joins members", regex: /JOIN\s+members/i, errorMessage: "Join the members table" },
            { id: "test3", description: "Filters date", regex: /WHERE\s+loans\.return_date\s*<\s*'2026-01-01'/i, errorMessage: "Filter for overdue books" }
          ]
        }
      }
    ]
  }
];

export const SQL_LESSONS = SQL_CHAPTERS.flatMap((ch) =>
  ch.lessons.map((l) => ({
    ...l,
    chapterId: ch.id,
    chapterTitle: ch.title,
    chapterColor: ch.color,
  }))
);

export const SQL_TOTAL_XP = SQL_LESSONS.reduce((sum, l) => sum + l.xp, 0);

applyLessonVideoLinks(SQL_LESSONS, SQL_VIDEO_LINKS);
