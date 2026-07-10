import { applyLessonVideoLinks } from "../../shared/applyLessonVideoLinks";
import { POWERSHELL_VIDEO_LINKS } from "./powershellVideoLinks";

const ACCENT = "#5391fe"; // PowerShell blue

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
      code: { lang: "powershell", ...codeBlock },
    };
  }
  return { type: "text", content };
}

export const POWERSHELL_CHAPTERS = [
  {
    id: "fundamentals",
    title: "PowerShell Fundamentals",
    icon: "🐚",
    color: ACCENT,
    lessons: [
      {
        id: "pwsh-fund-1",
        title: "What is PowerShell?",
        xp: 10,
        theory: [
          text("PowerShell is a cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework."),
          text("Unlike traditional shells that accept and return text, PowerShell accepts and returns .NET objects.")
        ],
        challenge: {
          title: "Hello World",
          description: "Output a string to the console.",
          instructions: ["Use Write-Host to print 'Hello World'"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses Write-Host", regex: /Write-Host/i, errorMessage: "Use Write-Host" },
            { id: "test2", description: "Prints Hello World", regex: /['"]Hello World['"]/i, errorMessage: "Output 'Hello World'" }
          ]
        }
      },
      {
        id: "pwsh-fund-2",
        title: "Cmdlets and Aliases",
        xp: 15,
        theory: [
          text("Commands in PowerShell are called cmdlets (command-lets). They follow a Verb-Noun naming convention (e.g., `Get-Process`).", { label: "List processes", content: "Get-Process" }),
          callout("tip", "You can use aliases for shorter typing. For example, `ls` and `dir` are aliases for `Get-ChildItem`.")
        ],
        challenge: {
          title: "Get Items",
          description: "List the items in the current directory using the standard cmdlet.",
          instructions: ["Write Get-ChildItem"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses Get-ChildItem", regex: /Get-ChildItem/i, errorMessage: "Use Get-ChildItem instead of ls or dir" }
          ]
        }
      }
    ]
  },
  {
    id: "scripting",
    title: "PowerShell Scripting",
    icon: "📝",
    color: ACCENT,
    lessons: [
      {
        id: "pwsh-script-1",
        title: "Variables and Types",
        xp: 20,
        theory: [
          text("Variables in PowerShell start with a `$`.", { label: "Declare variable", content: "$name = 'Alice'\n$age = 30" })
        ],
        challenge: {
          title: "Declare a Variable",
          description: "Declare a variable named `$message` and assign it the string value 'Hello PowerShell'.",
          instructions: ["Assign 'Hello PowerShell' to $message"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Declares $message", regex: /\$message\s*=\s*['"]Hello PowerShell['"]/i, errorMessage: "Assign 'Hello PowerShell' to $message" }
          ]
        }
      },
      {
        id: "pwsh-script-2",
        title: "Control Flow (If/Else)",
        xp: 25,
        theory: [
          text("You can use `if`, `elseif`, and `else` to control the flow of a script.", { label: "If statement", content: "if ($age -ge 18) {\n    Write-Host 'Adult'\n} else {\n    Write-Host 'Minor'\n}" }),
          callout("warning", "Notice that PowerShell uses operators like `-eq`, `-lt`, `-gt` instead of `==`, `<`, `>`.")
        ],
        challenge: {
          title: "Write an If statement",
          description: "Write an if statement checking if `$score` is greater than or equal to (`-ge`) 50.",
          instructions: ["Use if ($score -ge 50) { ... }"],
          defaultCode: "$score = 75\n\n",
          tests: [
            { id: "test1", description: "Uses if", regex: /if\s*\(/i, errorMessage: "Use an if statement" },
            { id: "test2", description: "Checks if score >= 50", regex: /\$score\s+-ge\s+50/i, errorMessage: "Check if $score -ge 50" }
          ]
        }
      }
    ]
  },
  {
    id: "automation",
    title: "PowerShell Automation",
    icon: "⚙️",
    color: ACCENT,
    lessons: [
      {
        id: "pwsh-auto-1",
        title: "The Pipeline",
        xp: 30,
        theory: [
          text("The pipeline (`|`) passes the output of one cmdlet as the input to another.", { label: "Pipeline example", content: "Get-Process | Where-Object { $_.CPU -gt 10 }" })
        ],
        challenge: {
          title: "Pipe commands",
          description: "Get all processes and pipe them to `Sort-Object CPU -Descending`.",
          instructions: ["Use Get-Process | Sort-Object CPU -Descending"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses Get-Process", regex: /Get-Process/i, errorMessage: "Start with Get-Process" },
            { id: "test2", description: "Pipes to Sort-Object", regex: /\|\s*Sort-Object\s+CPU\s+-Descending/i, errorMessage: "Pipe it to Sort-Object CPU -Descending" }
          ]
        }
      }
    ]
  },
  {
    id: "admin",
    title: "PowerShell Administration",
    icon: "🛠️",
    color: ACCENT,
    lessons: [
      {
        id: "pwsh-admin-1",
        title: "Managing Services",
        xp: 30,
        theory: [
          text("PowerShell can easily manage Windows Services using cmdlets like `Get-Service`, `Start-Service`, `Stop-Service`, and `Restart-Service`.")
        ],
        challenge: {
          title: "Stop a service",
          description: "Write a command to stop the service named 'Spooler'.",
          instructions: ["Use Stop-Service -Name 'Spooler'"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Uses Stop-Service", regex: /Stop-Service\s+-Name\s+['"]?Spooler['"]?/i, errorMessage: "Use Stop-Service -Name 'Spooler'" }
          ]
        }
      }
    ]
  },
  {
    id: "projects",
    title: "PowerShell Projects",
    icon: "🚀",
    color: ACCENT,
    lessons: [
      {
        id: "pwsh-proj-1",
        title: "System Report Script",
        xp: 100,
        theory: [
          text("Let's combine what we've learned to build a script that gathers system information and saves it to a file.")
        ],
        challenge: {
          title: "Output to File",
          description: "Get the current date and time (`Get-Date`) and pipe it into `Out-File -FilePath report.txt`.",
          instructions: ["Use Get-Date | Out-File -FilePath report.txt"],
          defaultCode: "",
          tests: [
            { id: "test1", description: "Gets Date", regex: /Get-Date/i, errorMessage: "Use Get-Date" },
            { id: "test2", description: "Pipes to Out-File", regex: /\|\s*Out-File\s+-FilePath\s+['"]?report\.txt['"]?/i, errorMessage: "Pipe to Out-File -FilePath report.txt" }
          ]
        }
      }
    ]
  }
];

export const POWERSHELL_LESSONS = POWERSHELL_CHAPTERS.flatMap((ch) =>
  ch.lessons.map((l) => ({
    ...l,
    chapterId: ch.id,
    chapterTitle: ch.title,
    chapterColor: ch.color,
  }))
);

export const POWERSHELL_TOTAL_XP = POWERSHELL_LESSONS.reduce((sum, l) => sum + l.xp, 0);

applyLessonVideoLinks(POWERSHELL_LESSONS, POWERSHELL_VIDEO_LINKS);
