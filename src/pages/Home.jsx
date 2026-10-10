// Your P3 home page sections, unchanged. Navbar and Footer are no longer
// rendered here: they now come from the shared Layout in App.jsx.
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Projects from "../components/Projects.jsx";
import FeaturedArticles from "../components/FeaturedArticles.jsx";
import FeaturedTutorials from "../components/FeaturedTutorials.jsx";
import SignupForm from "../components/SignupForm.jsx";
import Gallery from "../components/Gallery.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <FeaturedArticles />
      <FeaturedTutorials />
      <SignupForm />
      <Gallery />
    </>
  );
}
