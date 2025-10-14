import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink, BookOpen, Building2, GraduationCap, Shield, FileText } from "lucide-react";

const Publications = () => {
  const resourceCategories = [
    {
      title: "Trainers & Speakers",
      icon: GraduationCap,
      resources: [
        { name: "Adam McFadden — Hazmat by Road & Rail", url: "https://www.hazmat-by-road-rail.com/speaker/adam-mcfadden" },
        { name: "Adam McFadden — Webinar: Li-ion Best Management Practices", url: "https://www.w2ro.org/events/w2ro-webinar-series-lithium-ion-battery-best-management-practices-industry-perspectives" },
        { name: "Chris Pfaff — PHRT Hazmat & Rescue Instruction", url: "https://www.hazmatandrescue.com/lithium-ion-battery-hazards" },
        { name: "Chris Pfaff — Battery Fire Strategies (video)", url: "https://www.youtube.com/watch?v=gNDmQjAEq3Q" },
        { name: "Chris Pfaff — Provident Insurance Session (video)", url: "https://www.facebook.com/providentins/videos/learn-essential-strategies-for-tackling-battery-fires-from-chris-pfaff-lead-inst/2428274357571928/" },
        { name: "Matt Paiss — PNNL Profile", url: "https://www.pnnl.gov/experts/matthew-paiss" },
        { name: "Matt Paiss — EV/ESS Response (video)", url: "https://www.youtube.com/watch?v=vCRNhG_NV0A" },
        { name: "Matt Paiss — Battery Safety Deep Dive (video)", url: "https://www.youtube.com/watch?v=vyR6R4Q3v28" },
        { name: "Matt Paiss — NFPA 800 Development News", url: "https://www.pnnl.gov/news-media/pnnls-paiss-guides-development-unified-code-minimizing-battery-hazard-and-risk" },
        { name: "Dalan Zartman — ESA / BESS 24/7", url: "https://bess247.com/" },
        { name: "Dalan Zartman — Interview (podcast)", url: "https://www.buzzsprout.com/1884084/episodes/13702794-journeying-through-the-electric-vehicle-landscape-with-dalan-zartman-insights-safety-concerns-and-more" },
        { name: "C. Todd Smith (ATF) — Toxicity Handout (PDF)", url: "https://mil.wa.gov/asset/65fb007cb5dcc/Lithium%20Batteries%20Hazmat%20Handout%20-%20Toxicity%20-%20Todd%20Smith%2C%20ATF.pdf" },
        { name: "Chris Greene — Fire toxins & Li-ion effect", url: "https://www.fireengineering.com/firefighting-equipment/fire-ppe/fire-toxins-and-the-lithium-ion-effect/" },
        { name: "TEEX — EV/ESS Current Practices", url: "https://teex.org/ev-ess-current-practices/" },
        { name: "TEEX — EV & Stored Energy Summit", url: "https://teex.org/teex-electric-vehicle-and-stored-energy-summit/" },
        { name: "TEEX — EV/ESS Report (PDF)", url: "https://teex.org/wp-content/uploads/TEEX-EV-ESS-Report.pdf" },
        { name: "TEEX — YouTube Channel", url: "https://www.youtube.com/@TEEXagency" },
        { name: "IAFC — EV & Energy Storage Resources", url: "https://www.iafc.org/topics-and-tools/resources/resource/evs-electric-vehicles" },
        { name: "USFA/National Fire Academy — Course Catalog", url: "https://www.usfa.fema.gov/training/" },
        { name: "SFPE — Lithium-ion webinars & tech briefs", url: "https://www.sfpe.org/education" },
        { name: "IAAI — Training for investigators", url: "https://www.firearson.com/" }
      ]
    },
    {
      title: "U.S. Federal Agencies — Guidance",
      icon: Building2,
      resources: [
        { name: "USFA / FEMA — Lithium-ion Safety Hub", url: "https://www.usfa.fema.gov/a-z/lithium-ion-batteries/" },
        { name: "CPSC — Batteries Safety Center & Recalls", url: "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Batteries" },
        { name: "NHTSA — Electric Vehicles Safety", url: "https://www.nhtsa.gov/road-safety/electric-vehicles-evs" },
        { name: "OSHA — Lithium Battery Safety", url: "https://www.osha.gov/lithium-battery" },
        { name: "PHMSA — Lithium Batteries (Hazmat Shipping)", url: "https://www.phmsa.dot.gov/lithiumbatteries" },
        { name: "PHMSA — Lithium Battery Guide for Shippers", url: "https://www.phmsa.dot.gov/training/hazmat/lithium-battery-guide-shippers" },
        { name: "FAA Fire Safety — Lithium Battery Tests", url: "https://www.fire.tc.faa.gov/systems/lithium-batteries" },
        { name: "FAA — PackSafe: Lithium Batteries in Air Travel", url: "https://www.faa.gov/hazmat/packsafe/lithium-batteries" },
        { name: "EPA — Used Lithium-Ion Batteries", url: "https://www.epa.gov/recycle/used-lithium-ion-batteries" },
        { name: "EPA Region 4 — Lithium-Ion Outreach", url: "https://response.epa.gov/R4LithiumIonBatteryOutreach" },
        { name: "NTSB — Investigations & Recommendations", url: "https://www.ntsb.gov/" },
        { name: "DOE / AFDC — First Responder Resources", url: "https://afdc.energy.gov/vehicles/electric-responders" },
        { name: "DHS S&T — Lithium-Ion Battery Hazards", url: "https://www.dhs.gov/science-and-technology/news/2024/12/13/fighting-fire-knowledge-lithium-ion-battery-hazards" },
        { name: "DHS NUSTL — First Responder Technology", url: "https://www.dhs.gov/science-and-technology/national-urban-security-technology-laboratory" },
        { name: "DHS SAVER — Batteries for Firefighting Equipment", url: "https://www.dhs.gov/sites/default/files/2023-07/Batteries%20for%20Firefighting%20Equipment%20TechNote_Final_508.pdf" },
        { name: "DHS SAVER — Battery-Powered Rescue Tools", url: "https://www.dhs.gov/science-and-technology/saver/st-battery-powered-rescue-tools-vehicle-extrication" },
        { name: "NIST — Battery Safety & Early Failure Detection", url: "https://www.nist.gov/battery" },
        { name: "NIST — AI Detection of Battery Fires", url: "https://www.nist.gov/news-events/news/2024/11/ai-can-hear-when-lithium-battery-about-catch-fire" },
        { name: "ATF — Fire Research Laboratory", url: "https://www.atf.gov/arson/fire-research-laboratory" },
        { name: "USDOT — Battery Safety Stakeholder Meeting", url: "https://www.transportation.gov/battery-safety-post-incident-stakeholder-meeting" }
      ]
    },
    {
      title: "State Fire Marshals",
      icon: Shield,
      resources: [
        { name: "California — Office of the State Fire Marshal", url: "https://osfm.fire.ca.gov/" },
        { name: "California — Battery Energy Storage Systems (BESS)", url: "https://osfm.fire.ca.gov/what-we-do/code-development-and-analysis/battery-energy-storage-systems" },
        { name: "Florida — Division of State Fire Marshal", url: "https://myfloridacfo.com/division/sfm" },
        { name: "Florida — Lithium-Ion Safety Hub", url: "https://myfloridacfo.com/division/sfm#lithium-ion" },
        { name: "Florida — Li-ion Battery Symposium Resources", url: "https://myfloridacfo.com/division/sfm/lithium-ion-battery-symposium-resources" },
        { name: "Idaho — Li-ion Consumer Alert", url: "https://doi.idaho.gov/pressrelease/consumer-alert-state-fire-marshals-office-reminds-consumers-to-be-lithium-ion-battery-safe/" },
        { name: "Illinois — Public Awareness (Li-ion)", url: "https://ltgov.illinois.gov/news/press-release.31411.html" },
        { name: "Massachusetts — Li-ion Safety Reminder", url: "https://www.mass.gov/news/e-bike-fire-prompts-lithium-ion-battery-safety-reminder" },
        { name: "Oregon — Battery Safety", url: "https://www.oregon.gov/osfm/education/pages/battery_safety.aspx" },
        { name: "Tennessee — Li-ion Safety Reminder", url: "https://www.tn.gov/commerce/news/2025/7/17/sfmo-reminds-tennesseans-about-risks-of-lithium-ion-batteries.html" },
        { name: "Washington — Li-ion Safety Tips", url: "https://wsp.wa.gov/2024/02/17/lithium-ion-battery-safety/" },
        { name: "New York — OFPC", url: "https://www.dhses.ny.gov/office-fire-prevention-and-control" },
        { name: "Texas — State Fire Marshal's Office", url: "https://www.tdi.texas.gov/fire/" }
      ]
    },
    {
      title: "Major City Fire Departments",
      icon: Shield,
      resources: [
        { name: "FDNY — Lithium-Ion Battery Safety (NYC)", url: "https://www.nyc.gov/site/fdny/codes/reference/lithium-ion-battery-safety.page" },
        { name: "Seattle Fire Department — Lithium-Ion Safety", url: "https://www.seattle.gov/fire/safety-and-community/lithium-ion-battery-safety" },
        { name: "San Francisco Fire Department", url: "https://sf-fire.org/safety-resources-and-information/lithium-ion-battery-safety" },
        { name: "San Diego Fire-Rescue", url: "https://www.sandiego.gov/fire/community-outreach/safety-tips/lithium-ion-safety" },
        { name: "San José Fire Department", url: "https://www.sanjoseca.gov/your-government/departments-offices/fire-department/public-education/fire-prevention/lithium-ion-battery-safety" },
        { name: "Phoenix Fire Department — Battery Safety", url: "https://www.phoenix.gov/administration/departments/fire/safety-prevention/fire-safety-information/battery-safety.html" },
        { name: "Portland Fire & Rescue — EV/ESS Fire Tool", url: "https://www.portland.gov/fire/news/2025/5/12/new-tool-helps-portland-firefighters-tackle-electric-vehicle-fires" },
        { name: "Los Angeles County HHMD — Managing Risks (PDF)", url: "https://pw.lacounty.gov/epd/debris-removal/docs/MANAGING%20RISKS%20FROM%20DAMAGED%20LIBs%2C%20STORAGE%20SYSTEMS%2C%20AND%20EVS%2001.13.25.pdf" },
        { name: "Austin Fire — LiB ESS Plan Review (PDF)", url: "https://www.austintexas.gov/sites/default/files/files/Fire/Prevention/Plans_Review/79189736_Stationary%20LiB%20ESS%20Plan%20Review%20Submittal_10172023.pdf" },
        { name: "Los Angeles City FD — E-Mobility Safety", url: "https://www.lafd.org/safety/electric-micromobility" }
      ]
    },
    {
      title: "Testing Labs & Research",
      icon: FileText,
      resources: [
        { name: "UL Solutions — UL 9540A (BESS Fire Propagation)", url: "https://www.ul.com/resources/ul-9540a-test-method-evaluating-thermal-runaway-fire-propagation-battery-energy-storage" },
        { name: "UL Solutions — Advanced Battery Laboratory", url: "https://www.ul.com/resources/ul-solutions-north-america-advanced-battery-laboratory" },
        { name: "UL Research Institutes — Electrochemical Safety", url: "https://ul.org/institutes-offices/electrochemical-safety/our-research-findings/" },
        { name: "FSRI — Lithium-Ion Battery Guide", url: "https://fsri.org/lithium-ion-battery-guide" },
        { name: "FSRI — Arizona ESS Incident Report", url: "https://fsri.org/research-update/report-four-firefighters-injured-lithium-ion-battery-energy-storage-system" },
        { name: "NREL — Battery Safety & Failure Databank", url: "https://www.nrel.gov/transportation/battery-safety.html" },
        { name: "PNNL — Battery Reliability Test Laboratory", url: "https://www.pnnl.gov/battery-reliability-test-laboratory" },
        { name: "Sandia National Labs — Battery Abuse Testing", url: "https://energy.sandia.gov/programs/energy-storage/battery-abuse-testing-lab/" },
        { name: "Argonne National Lab — Battery Science", url: "https://www.anl.gov/battery" },
        { name: "Idaho National Lab — Energy Storage", url: "https://inl.gov/energy-environment/energy-storage/" },
        { name: "FAA — Lithium Battery Testing & Reports", url: "https://www.fire.tc.faa.gov/systems/lithium-batteries" },
        { name: "Iowa State — Blast Box Thermal Runaway Testing", url: "https://www.inside.iastate.edu/article/2025/07/22/charred-chunks-blast-box-reducing-risk-battery-fires-explosions" }
      ]
    },
    {
      title: "Insurers & Risk Engineering",
      icon: Shield,
      resources: [
        { name: "Travelers — Lithium-Ion Battery Fire Safety", url: "https://www.travelers.com/resources/business-industries/fire-safety/lithium-ion-battery-fire-safety" },
        { name: "Zurich — Lithium-Ion Battery Guidance", url: "https://www.zurich.com/en/knowledge/topics/lithium-ion-batteries" },
        { name: "Chubb — Lithium-Ion Battery Safety", url: "https://www.chubb.com/us-en/business-insurance/resources/lithium-ion-battery-safety.html" },
        { name: "FM Global — Lithium-Ion Research", url: "https://www.fmglobal.com/research-and-resources/research/lithium-ion-batteries" },
        { name: "AIG — Lithium-Ion Batteries (Risk Engineering)", url: "https://www.aig.com/insurance/commercial/engineering/lithium-ion-batteries" },
        { name: "AIG — Warehouse Storage (PDF)", url: "https://www.aig.com/content/dam/aig/america-canada/us/documents/business/risk-engineering/mrc/mrc-li-ion-warehouse-store-aig.pdf" },
        { name: "AIG — Recyclers Exposure (PDF)", url: "https://www.aig.com/content/dam/aig/america-canada/us/documents/business/risk-engineering/fire-property/li-ion-recyclers-aig.pdf.coredownload.pdf" },
        { name: "Liberty Mutual Re — Battery Safety Article", url: "https://www.libertymutualre.com/article/battery-safety-high-standards-high-rewards" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-accent/10 rounded-full mb-6">
              <BookOpen className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              Lithium-Ion Battery Fire Resources
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Government, Training, Utilities, Insurance, Testing & Standards — All in One Place
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
              A comprehensive directory of lithium-ion battery fire safety resources from government agencies, training organizations, testing laboratories, and industry experts.
            </p>
          </div>
        </div>
      </section>

      {/* Resources by Category */}
      {resourceCategories.map((category, categoryIndex) => (
        <section 
          key={categoryIndex} 
          className={`py-16 md:py-20 ${categoryIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <category.icon className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  {category.title}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {category.resources.map((resource, index) => (
                  <Card key={index} className="border hover:border-accent hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-4">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-3"
                      >
                        <span className="text-foreground/90 group-hover:text-accent transition-colors flex-1">
                          {resource.name}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Coming Soon Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
              KnightTek Blog & Insights
            </h2>
            <p className="text-lg text-foreground/80 mb-6">
              Stay tuned for expert insights, product updates, and industry analysis from our team. Monthly posts from Matt Hill and podcast content coming soon.
            </p>
            <Card className="border-2 border-accent/20 bg-card">
              <CardContent className="p-8">
                <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                  <Newspaper className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Coming Soon: Expert Content & Podcasts
                </h3>
                <p className="text-foreground/70 mb-4">
                  Subscribe to our newsletter to be notified when we launch our blog and podcast series featuring industry experts and real-world case studies.
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Subscribe for Updates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary to-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
            Have a Resource to Add?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Know of a valuable lithium-ion battery fire safety resource? Contact us to have it added to this directory.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <p className="mt-6 text-primary-foreground/90">
            Email: <a href="mailto:info@ktekglobal.com" className="text-accent font-semibold hover:underline">info@ktekglobal.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Publications;
