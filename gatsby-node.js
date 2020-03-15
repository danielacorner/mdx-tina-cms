const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const deckComponent = path.resolve(`./src/templates/deck.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            frontmatter {
              slug
              title
            }
            rawMarkdownBody
            html
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create decks pages.
  const decks = result.data.allMarkdownRemark.nodes

  decks.forEach((deck, index) => {
    const { frontmatter, rawMarkdownBody, html } = deck
    const { slug, title } = frontmatter

    const previous = index === decks.length - 1 ? null : decks[index + 1].node
    const next = index === 0 ? null : decks[index - 1].node
    if (slug) {
      createPage({
        path: slug,
        component: deckComponent,
        context: {
          previous,
          next,
          slug,
          title,
          rawMarkdownBody,
          html,
        },
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
