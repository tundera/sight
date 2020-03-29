/** @jsx jsx */
import { Fragment } from "react"
import { useContext } from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import {
  Container,
  Flex,
  Box,
  Card,
  Button,
  Heading,
  Text,
  Spinner,
} from "@theme-ui/components"

import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

import { SkinContext } from "../context"

import { ThemeWrapper } from "../components/ThemeWrapper"
import { Seo } from "../components/Seo"
import { Header } from "../components/Header"
import { Logo } from "../components/Logo"
import { Footer } from "../components/Footer"

import { useSiteMetadata } from "../data/useSiteMetadata"

const GET_THEMES_BY_USER = gql`
  query GetThemesByUserQuery($user_id: String!) {
    getThemesByUser(user_id: $user_id) {
      ref
      user_id
      theme_author
      theme_name
      theme_description
      theme_style
      theme_is_private
      theme_object
    }
  }
`

const YourThemes = () => {
  const { state } = useContext(SkinContext)

  const { loading, error, data } = useQuery(GET_THEMES_BY_USER, {
    variables: { user_id: (state.user && state.user.id) || "" },
  })

  const {
    site: {
      siteMetadata: {
        author,
        title,
        description,
        url,
        ogImage,
        keywords,
        lang,
      },
    },
  } = useSiteMetadata()

  return (
    <ThemeWrapper>
      <Seo
        author={author}
        title={title}
        titleTemplate="Your Themes"
        description={description}
        url={url}
        ogImage={ogImage}
        path="/your-themes"
        keywords={keywords}
        lang={lang}
      />

      <Header left={<Logo />} />

      <main
        sx={{
          minHeight: theme => `calc(100vh - ${theme.sizes.doubleHeader}px)`,
        }}
      >
        <Container>
          <Flex sx={{ flexWrap: "wrap", height: "100%" }}>
            {state.user && (
              <Fragment>
                <Box
                  sx={{
                    mr: 3,
                    flex: "1 1 auto",
                  }}
                >
                  <Heading as="h1" variant="styles.h1" sx={{ mb: 3 }}>
                    {`${state.user.user_metadata.full_name}'s Themes`}
                  </Heading>
                </Box>
                <Box sx={{ justifyContent: "flex-end", mb: 5 }}>
                  <Button as={Link} to="/editor">
                    Create new theme
                  </Button>
                </Box>
              </Fragment>
            )}
          </Flex>

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Spinner />
            </Box>
          )}
          {error && <Text>{`${error}`}</Text>}
          {!loading && !error && (
            <Flex
              sx={{
                flexWrap: "wrap",
                ml: theme => `-${theme.space[2]}px`,
                mr: theme => `-${theme.space[2]}px`,
              }}
            >
              {data.getThemesByUser.map((item, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flex: "1 1 auto",
                      flexDirection: "column",
                      mb: 3,
                      maxWidth: ["100%", "100%", "50%", "50%"],
                      width: ["100%", "100%", "50%", "50%"],
                    }}
                  >
                    <Link
                      to={`/editor?theme_id=${item.ref}`}
                      sx={{
                        textDecoration: "none",
                        display: "flex",
                        flex: "1 1 auto",
                        flexDirection: "column",
                        m: theme => `0px ${theme.space[2]}px`,
                        minHeight: "1px",
                      }}
                    >
                      <Card
                        sx={{
                          backgroundColor: "darken",
                          display: "flex",
                          flex: "1 1 auto",
                          flexDirection: "column",
                          minHeight: "1px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flex: "1 1 auto",
                            flexDirection: "column",
                            p: 3,
                          }}
                        >
                          <Heading
                            as="h2"
                            variant="styles.h2"
                            sx={{ color: "text", mb: 2 }}
                          >
                            {item.theme_name}
                          </Heading>
                          <Text sx={{ color: "text" }}>
                            {item.theme_description}
                          </Text>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <Text
                            sx={{
                              color: "text",
                              textTransform: "capitalize",
                              mb: 4,
                            }}
                          >
                            {item.theme_style}
                          </Text>
                          <Text
                            sx={{
                              color: "secondary",
                              textDecoration: "underline",
                            }}
                          >
                            View Theme
                          </Text>
                        </Box>
                      </Card>
                    </Link>
                  </Box>
                )
              })}
            </Flex>
          )}
        </Container>
      </main>
      <Footer />
    </ThemeWrapper>
  )
}

export default YourThemes
