import { JSONContent } from '@tiptap/core'

import { NodeName, Section } from '@/types/builder'

import { LANGUAGES_SETUP } from './constants'
import { LIST_TEMPLATES } from './templates'
import { getSetupCommands } from './utils/commands'

export const README_SECTIONS_DATA: Section[] = [
  {
    // TODO: Add new approach
    id: NodeName.BANNER,
    name: 'Banner',
    emoji: '🏞️',
    description: 'Picture of your project.',
    add: async ({ editor, endPos }) => {
      editor.chain().insertContentAt(endPos, '<Banner />').focus('end').run()
    }
  },
  {
    id: NodeName.TECH_STACK,
    name: 'Stack',
    emoji: '💻',
    description: 'Information about the technology stack used in the project.',
    add: async ({ editor, endPos, data }) => {
      let content: JSONContent = {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Include a concise explanation about the Tech Stack employed.' }
        ]
      }

      if (data.content.length > 0) {
        const listItems: any = []
        data.content.forEach((item: any) => {
          const { name, link, description } = item
          listItems.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'link',
                        attrs: {
                          href: link,
                          target: '_blank'
                        }
                      }
                    ],
                    text: name
                  },
                  {
                    type: 'text',
                    text: `: ${description}`
                  }
                ]
              }
            ]
          })
        })

        content = {
          type: 'bulletList',
          attrs: { class: 'list-disc list-outside leading-4 tight' },
          content: listItems
        }
      }

      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Stack' }]
          },
          content
        ])
        .focus()
        .run()
      // editor.chain().insertTechStack({ endPos, ...data })
    }
  },
  {
    id: NodeName.PROJECT_SUMMARY,
    name: 'Project Summary',
    emoji: '📝',
    description: 'A brief summary of the project.',
    add: async ({ editor, endPos, data }) => {
      let content: JSONContent = {
        type: 'paragraph',
        content: [{ type: 'text', text: `Insert your project's summary.` }]
      }

      if (data.content.length > 0) {
        const listItems: any = []
        data.content.forEach((item: any) => {
          const { name, link, description } = item
          listItems.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    marks: [
                      {
                        type: 'link',
                        attrs: {
                          href: link,
                          target: '_blank'
                        }
                      }
                    ],
                    text: name
                  },
                  {
                    type: 'text',
                    text: `: ${description}`
                  }
                ]
              }
            ]
          })
        })

        content = {
          type: 'bulletList',
          attrs: { class: 'list-disc list-outside leading-4 tight' },
          content: listItems
        }
      }

      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Project Summary' }]
          },
          content
        ])
        .focus()
        .run()
      // editor.chain().insertProjectSummary({ endPos, ...data })
    }
  },
  {
    id: NodeName.SETTING_UP,
    name: 'Setting Up',
    emoji: '⚙️',
    description: 'Instructions on setting up the project.',
    add: async ({ editor, endPos, data }) => {
      const defaultContent = [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Setting Up' }]
        }
      ]

      if (data.content.length > 0) {
        data.content.forEach((item: any) => {
          const listSteps: any = []
          const { name, steps } = item
          const heading = {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: name }]
          }
          defaultContent.push(heading)

          steps.forEach((step: string) => {
            listSteps.push({
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `${step}`
                    }
                  ]
                }
              ]
            })
          })

          const bulletList = {
            type: 'bulletList',
            attrs: { class: 'list-disc list-outside leading-4 tight' },
            content: listSteps
          }
          // @ts-ignore
          defaultContent.push(bulletList)
        })
      } else {
        const content: JSONContent = {
          type: 'paragraph',
          content: [{ type: 'text', text: `Insert your environment variables.` }]
        }
        // @ts-ignore
        defaultContent.push(content)
      }

      editor.chain().insertContent(defaultContent).focus().run()
      // editor.chain().insertEnvVariablesGuide({ endPos, ...data })
    }
  },
  {
    id: NodeName.RUN_LOCALLY,
    name: 'Run Locally',
    emoji: '🚀',
    description: 'Guidelines on running the project locally.',
    add: async ({ editor, endPos, data }) => {
      const { mainLanguage, repoName, urlRepository } = data

      const setup = LANGUAGES_SETUP.find((item) => item.languages.includes(mainLanguage))
      const secondStep = setup
        ? getSetupCommands({ commands: setup.commands['install'] })
        : `Insert INSTALL commands`
      const thirdStep = setup
        ? getSetupCommands({ commands: setup.commands['run'] })
        : `Insert RUN commands`

      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Run Locally' }]
          },
          {
            type: 'orderedList',
            attrs: { tight: true, start: 1 },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: `Clone ${repoName} repository:` }]
                  },
                  {
                    type: 'codeBlock',
                    attrs: { language: 'bash' },
                    content: [{ type: 'text', text: `git clone ${urlRepository}` }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `Install the dependencies with one of the package managers listed below:`
                      }
                    ]
                  },
                  {
                    type: 'codeBlock',
                    attrs: { language: 'bash' },
                    content: [{ type: 'text', text: `${secondStep}` }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `Start the development mode:`
                      }
                    ]
                  },
                  {
                    type: 'codeBlock',
                    attrs: { language: 'bash' },
                    content: [{ type: 'text', text: `${thirdStep}` }]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertRunLocally({ endPos, data })
    }
  },
  {
    // TODO: Add new approach
    id: NodeName.CONTRIBUTORS,
    name: 'Contributors',
    emoji: '🙌',
    description: 'Recognition about project contributors.',
    add: async ({ editor, endPos, data }) => {
      editor.chain().insertContributors({ endPos, data })
    }
  },
  {
    id: NodeName.LICENSE,
    name: 'License',
    emoji: '📄',
    description: 'Details about the licensing of the project.',
    add: async ({ editor, endPos, data }) => {
      let content: JSONContent = [
        { type: 'text', marks: [{ type: 'bold' }], text: 'Add your License' }
      ]

      if (data) {
        const { name, url } = data
        content = [
          { type: 'text', text: 'This project is licensed under the ' },
          { type: 'text', marks: [{ type: 'bold' }], text: name },
          { type: 'text', text: ' - ' },
          { type: 'text', text: 'see the ' },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: url,
                  target: '_blank'
                }
              }
            ],
            text: name
          },
          { type: 'text', text: ' file for details.' }
        ]
      }

      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'License' }]
          },
          {
            type: 'paragraph',
            content
          }
        ])
        .focus()
        .run()
      // editor
      //   .chain()
      //   .insertContent(
      //     `<h2>License</h2>
      //       <p>
      //         <strong>Add your License</strong>
      //       </p>`
      //   )
      //   .focus()
      //   .run()
      // editor.chain().insertLicense({
      //   endPos,
      //   license: data
      // })
    }
  },
  {
    id: NodeName.PROJECT_STRUCTURE,
    name: 'Project Structure',
    emoji: '📁',
    description: 'Overview of the structure of the project.',
    add: async ({ editor, endPos, data }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Project Structure' }]
          },
          {
            type: 'codeBlock',
            attrs: { language: 'bash' },
            content: [{ type: 'text', text: data }]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertProjectStructure({
      //   endPos,
      //   tree: data
      // })
    }
  },
  {
    id: NodeName.DEPLOY,
    name: 'Deploy',
    emoji: '☁️',
    description: 'Instructions on deploying the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Deploy' }]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Insert your application URL.'
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Deploy />').focus('end').run()
    }
  },
  {
    id: NodeName.ROADMAP,
    name: 'Roadmap',
    emoji: '🗺️',
    description: 'The planned development path of the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Roadmap' }]
          },
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold'
                          }
                        ],
                        text: 'Task 1:'
                      },
                      { type: 'text', text: ' Implement feature one.' }
                    ]
                  }
                ]
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold'
                          }
                        ],
                        text: 'Task 2:'
                      },
                      { type: 'text', text: ' Implement feature two.' }
                    ]
                  }
                ]
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold'
                          }
                        ],
                        text: 'Task 3:'
                      },
                      { type: 'text', text: ' Implement feature three.' }
                    ]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Roadmap />').focus('end').run()
    }
  },
  {
    id: NodeName.ACKNOWLEDGEMENTS,
    name: 'Acknowledgements',
    emoji: '🙏',
    description: 'Highlighting invaluable support.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Acknowledgements' }]
          },
          {
            type: 'bulletList',
            attrs: { class: 'list-disc list-outside leading-4 tight' },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', text: 'Thanks to ' },
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'https://lucide.dev/',
                              target: '_blank'
                            }
                          }
                        ],
                        text: 'Lucide icons.'
                      }
                    ]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'https://awesomeinsp.link',
                              target: '_blank'
                            }
                          }
                        ],
                        text: 'Awesome Inspiration.'
                      }
                    ]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', text: 'Thanks to this outstanding resource ' },
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'https://awesomeinsp.link',
                              target: '_blank'
                            }
                          }
                        ],
                        text: 'Awesome Tool.'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Acknowledgments />').focus('end').run()
    }
  },
  {
    id: NodeName.CHANGELOG,
    name: 'Changelog',
    emoji: '📜',
    description: 'Record of changes made to the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Changelog' }]
          },
          {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: '[Version X.X.X] - YYYY-MM-DD' }]
          },
          {
            type: 'bulletList',
            attrs: { class: 'list-disc list-outside leading-4 tight' },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', text: 'New features or enhancements added in this release.' }
                    ]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Fixes to errors or problems' }]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Changelog />').focus('end').run()
    }
  },
  {
    id: NodeName.PREREQUISITES,
    name: 'Prerequisites',
    emoji: '✅',
    description: 'List of dependencies needed to use the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Prerequisites' }]
          },
          {
            type: 'bulletList',
            attrs: { class: 'list-disc list-outside leading-4 tight' },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Prerequisite 1.' }]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Prerequisite 2.' }]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Prerequisites />').focus('end').run()
    }
  },
  {
    id: NodeName.FAQ,
    name: 'FAQ',
    emoji: '🤔',
    description: 'Questions and their answers related to the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'FAQ' }]
          },
          {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: '1.What is this project about?' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This project aims to ' },
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: `briefly describe your project's purpose and goals.`
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: '2.How can I contribute to this project?' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Yes, we welcome contributions! Please refer to our ' },
              {
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'CONTRIBUTING.md',
                      target: '_blank'
                    }
                  }
                ],
                text: 'Contribution Guidelines'
              },
              { type: 'text', text: ' for more information on how to contribute.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: '3.What is this project about?' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Your answer.' }]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Faq />').focus('end').run()
    }
  },
  {
    id: NodeName.COMMANDS,
    name: 'Commands',
    emoji: '⚡',
    description: 'Commonly used commands or actions in the project.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Commands' }]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This extension contributes the following commands to the Command palette:'
              }
            ]
          },
          {
            type: 'bulletList',
            attrs: { class: 'list-disc list-outside leading-4 tight' },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold'
                          }
                        ],
                        text: 'Command name:'
                      },
                      { type: 'text', text: ' Command description.' }
                    ]
                  }
                ]
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold'
                          }
                        ],
                        text: 'Authenticate:'
                      },
                      { type: 'text', text: ' Command description.' }
                    ]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertContentAt(endPos, '<Commands />').focus('end').run()
    }
  },
  {
    // TODO: Add new approach
    id: NodeName.TABLE_CONTENTS,
    name: 'Table of Contents',
    emoji: '🔍',
    description: 'An organized list of contents for easy navigation.',
    add: async ({ editor, endPos }) => {
      editor.chain().insertTableContents({ endPos })
    }
  },
  {
    id: NodeName.OVERVIEW,
    name: 'Overview',
    emoji: '📌',
    description: 'An Overview for high-level project understanding.',
    add: async ({ editor, endPos, data }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Overview' }]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: data === '' ? 'Insert a brief overview of your project' : data.content
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertOverview({ endPos, ...data })
    }
  },
  {
    id: NodeName.BADGE,
    name: 'Badges',
    emoji: '🛡️',
    description: 'Show metrics for your project.',
    add({ editor, endPos, data }) {
      const { badges, owner, repoName } = data
      const list = []
      for (let i = 0; i < badges.length; i++) {
        const badge = badges.at(i)
        if (!badge) return
        // const pos = endPos + i
        const { name, url, isGithub } = badge ?? {}
        const badgeUrl = isGithub ? `${url}/${owner}/${repoName}` : url

        list.push({
          type: 'image',
          attrs: {
            src: badgeUrl,
            alt: name,
            title: name,
            width: null,
            height: null
          }
        })
      }

      editor
        .chain()
        .insertContent([
          {
            type: 'paragraph',
            attrs: { align: 'center' },
            content: list
          }
        ])
        .focus()
        .run()

      // editor.chain().insertBadge({
      //   endPos: pos,
      //   data: {
      //     label: name,
      //     url: badgeUrl
      //   }
      // })
    }
  },
  {
    id: NodeName.API_REFERENCE,
    name: 'Api Reference',
    emoji: '🚀',
    description: 'All the information required to work with the API.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Api Reference' }]
          },
          {
            type: 'heading',
            attrs: { level: 4 },
            content: [{ type: 'text', text: 'Get all products' }]
          },
          {
            type: 'codeBlock',
            attrs: { language: 'bash' },
            content: [{ type: 'text', text: 'GET /api/products' }]
          },
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Name'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Type'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Optional'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Description'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'term'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'string'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'required'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Search term.'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertApiReference({
      //   endPos
      // })
    }
  },
  {
    id: NodeName.FEEDBACK,
    name: 'Feedback',
    emoji: '🫶',
    description: 'Share your thoughts, suggestions, and concerns.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Feedback' }]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'If you have any feedback, please reach out to us at '
              },
              {
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'mailto:random@company.com',
                      target: '_blank'
                    }
                  }
                ],
                text: 'random@company.com'
              },
              {
                type: 'text',
                text: '.'
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertFeedback({
      //   endPos
      // })
    }
  },
  {
    id: NodeName.LIB_PROPS,
    name: 'Table Props',
    emoji: '🧾',
    description: 'Table that contains your NPM package props.',
    add: async ({ editor, endPos }) => {
      editor
        .chain()
        .insertContent([
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Table Props' }]
          },
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Property'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Type'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Default'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Description'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'width'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'number'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: '360'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: `Width of the component, e.g. 600 or '100vw' or 'inherit'.`
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'height'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'number'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: '640'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: `Height of the component, e.g. 1000 or '100%' or 'inherit'.`
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ])
        .focus()
        .run()
      // editor.chain().insertLibProps({
      //   endPos
      // })
    }
  }
]

export const DEFAULT_INITIAL_SECTIONS = LIST_TEMPLATES.find(
  (template) => template.nameTemplate === 'Minimal'
)!.sections as NodeName[]
