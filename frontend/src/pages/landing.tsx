import { Navbar, NavGroup, NavTitle, NavLink } from "../components/utility/navbar";
import "../styles/landing.css";

export default function Landing({}): JSX.Element {
    return (
        <div className="mx_landing_page">
            <div className="mx_landing_background"></div>
            <div className="mx_landing_head">
                <h1>BLAKE PREJEAN</h1>
                <span>
                    {"I'm just trying to make it..."}
                    <br />
                    {"Here's to"} <strong>Hoping</strong>{"!"}
                </span>
            </div>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Navbar top={0.0001} zIndex={1}>
                    <NavGroup>
                        <NavTitle>
                            Blake Prejean
                        </NavTitle>
                    </NavGroup>
                    <NavGroup>
                        <NavLink href="/pathfinder">
                            Pathfinder
                        </NavLink>
                        <NavLink href="/sorting">
                            Sorting
                        </NavLink>
                        <NavLink href="/snake">
                            Snake
                        </NavLink>
                    </NavGroup>
                </Navbar>
                <div className="mx_landing_bio">
                    <h1>About Me</h1>
                    <div>
                        <p>
                            I am Blake...
                        </p>
                        <p>
                            TLDR; Young with a lot of <strong>passion</strong>, please give the chance
                            to <em>prove</em> it!
                        </p>
                        <p>
                            I currently a Systems Engineer at a small tech
                            company Centriserve I.T. aspiring to be an engineer.
                            My passions lie with Software Engineering, I love
                            writing 2D and 3D games and engines in my spare time
                            {"but it's hard to get kick started in that field sadly."}
                            So what better than to become a web developer!
                            <br />
                            <strong>
                                I love C++, C#, Python, JavaScript and Node for
                                programming!
                            </strong>
                        </p>
                        <p>
                            {"Now hear me out, I don't have a lot of experience, but"}
                            I do have experience. I have been working on an internal
                            website for my company for the past year building tools
                            {"to interface with API's for our management websites and"}
                            {"create reports from their data that they can't do themselves."}
                            Fun stuff right?
                        </p>
                        <p>
                            All the code for this project can be found at 
                            <a href="https://github.com/ModdedXero/CentriserveToolsNextJS"> https://github.com/ModdedXero/CentriserveToolsNextJS
                            </a>.
                            The project started as a MERN stack but I found NextJS and
                            thought it was cool so I moved it over to there.
                        </p>
                        <p>
                            Past that project I hope this current project you are
                            looking at catches your eye! Cause that is all I got for now...
                            I hope you give me a chance but please feel free to browse
                            through the projects above on the Navbar and if you want to
                            return to this beautiful page just click on the title of any
                            Navbar to come back here!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}