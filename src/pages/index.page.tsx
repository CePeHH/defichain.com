import { HomePageHeader } from "@components/index/HomePageHeader";
import { BlockchainFeaturesSection } from "@components/index/BlockchainFeaturesSection";
import { Head } from "@components/commons/Head";
import { DeFiChainEcoSystemSection } from "@components/index/DeFiChainEcoSystemSection";
import { StatsDisplay } from "@components/index/StatisticsDisplay";
import { ReadyForFlexibility } from "@components/index/ReadyForFlexibility";
import { Container } from "@components/commons/Container";
import { StartExploringButton } from "@components/commons/StartExploringButton";
import { YearAheadRoadMapSection } from "@components/index/RoadMapSection";
import { BlogPostsSection } from "@components/index/blogPosts/BlogPostsSection";
import { useTranslation } from "../hooks/useTranslation";
import { getBlogspotPosts, type Post } from "../lib/blogspotApi";

export default function HomePage({
  blogPosts,
}: {
  blogPosts: Post[];
}): JSX.Element {
  const { t } = useTranslation("page-index");

  return (
    <>
      <Head title={t("Header.title")} />
      <HomePageHeader />
      <Container className="justify-center md:mt-0 mt-9 hidden md:flex relative z-10">
        <StartExploringButton startExploringJumpLink="#statistics_display" />
      </Container>
      <StatsDisplay />
      <BlockchainFeaturesSection />
      <DeFiChainEcoSystemSection />
      <ReadyForFlexibility />
      <YearAheadRoadMapSection />
      <BlogPostsSection blogPosts={Array.isArray(blogPosts) ? blogPosts : []} />
    </>
  );
}

export async function getStaticProps() {
  console.log("[getStaticProps] Starting data fetching for the main page.");
  console.log(`[getStaticProps] Netlify CONTEXT: ${process.env.CONTEXT}`);

  try {
    const posts = await getBlogspotPosts();
    console.log(
      `[getStaticProps] Successfully fetched ${posts.length} blog posts.`,
    );
    const props = { blogPosts: posts.slice(0, 8) };

    const isDeployPreview = process.env.CONTEXT === "deploy-preview";
    if (isDeployPreview) {
      console.log("[getStaticProps] Deploy preview detected, disabling ISR.");
      return { props };
    }

    console.log(
      "[getStaticProps] Production environment detected, enabling ISR with revalidate: 3600.",
    );
    return { props, revalidate: 3600 }; // ISR for prod
  } catch (error) {
    console.error("[getStaticProps] Failed to fetch blog posts:", error);
    // Fallback to returning an empty array of posts to prevent the page from crashing.
    const props = { blogPosts: [] };
    return { props, revalidate: 60 }; // Re-attempt after 60 seconds
  }
}
