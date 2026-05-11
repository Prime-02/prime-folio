import AboutSection from '@/components/portfolio/AboutSection'
import HeroSection from '@/components/portfolio/HeroSection'
import SkillsSection from '@/components/portfolio/SkillsSection'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'
import ProjectsSection from './ProjectsSection'
import BlogSection from './BlogSection'
import TestimonialsSection from './TestiminialsSection'
import ContactSection from './ContactSection'

const MainSection = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <BlogSection />
      <TestimonialsSection/>
      <ContactSection/>
    </div>
  )
}

export default MainSection