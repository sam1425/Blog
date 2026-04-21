import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const About: React.FC = () => {
  useEffect(() => {
    const colorTooltip = document.querySelector('span.tooltip[style*="#00ffff"]');

    if (colorTooltip) {
      const handleClick = (e: Event) => {
        e.stopPropagation();
        const styleAttr = colorTooltip.getAttribute('style') || '';
        const match = styleAttr.match(/--tooltip-content:\s*['"]?([^';"]*)['"]?/);
        const tooltipContent = match ? match[1] : '';

        if (tooltipContent) {
          const textArea = document.createElement('textarea');
          textArea.value = tooltipContent;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);

          const originalContent = colorTooltip.textContent;
          colorTooltip.textContent = '<Copied>';
          setTimeout(() => {
            colorTooltip.textContent = originalContent;
          }, 1500);
        }
      };

      colorTooltip.addEventListener('click', handleClick);
      return () => colorTooltip.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <Layout title="About me">
      <main id="content" style={{ display: 'contents' }}>
        <div className="middlecard">
          <div className="card about-left-column">
            <h2>
              <span
                className="tooltip"
                style={{ '--tooltip-content': '"SAM"' } as React.CSSProperties}
              >
                .me
              </span>
            </h2>
            <ul style={{ paddingLeft: '10px', listStyle: 'none' }}>
              <li><span className="info">Name:</span> Sam</li>
              <li><span className="info">Age:</span> 19</li>
              <li><span className="info">Gender:</span> Male</li>
              <li>
                <span className="info">Languages:</span> Spanish(native),
                English(fluent)
              </li>
              <li>
                <span className="info">Status:</span> Undefined by the user :c
              </li>
              <li>
                <span className="info">Likes:</span> Programming, gaming, and
                doing cool stuff
              </li>
              <li>
                <span className="info">Favorite color:</span>{' '}
                <span
                  className="tooltip"
                  style={{
                    color: 'cyan',
                    '--tooltip-color': '#00ffff',
                    '--tooltip-content': '"#00ffff"',
                  } as React.CSSProperties}
                >
                  <span>This one</span>
                </span>
              </li>
              <li><span className="info">Strengths:</span> logical thinking</li>
              <li>Weaknesses: Social interaction, Expressing feelings/myself</li>
            </ul>
          </div>
          <div className="CardContainer about-right-column">
            <div className="card">
              <p>
                Hi there! I'm Samuel, but you can call me <strong>Sam</strong>.
                A 19-year-old PC enthusiast (aka computer nerd) who enjoys
                programming in his free time. Originally from{' '}
                <span id="colombia">
                  <span
                    style={{
                      color: '#ffcd00',
                      textShadow: '0 0 2px #ffcd00, 0 0 2px #ffcd00',
                    }}
                  >
                    Colo
                  </span>
                  <span
                    style={{
                      color: '#003087',
                      textShadow: '0 0 2px #003087, 0 0 2px #003087',
                    }}
                  >
                    mb
                  </span>
                  <span
                    style={{
                      color: '#c8102e',
                      textShadow: '0 0 2px #c8102e, 0 0 2px #c8102e',
                    }}
                  >
                    ia
                  </span>
                </span>
                . Most people describe me as quiet. Friends are few (at least
                those I truly consider as such), but feel free to reach out
                anytime on <a href="#channels">here</a> these as you may have
                guessed i like a lot fonts all kinds but specially the pixelated
                ones
              </p>
            </div>

            <div className="card">
              <h2>who is me</h2>
              <p>
                I don't have the answer to that, but I'm a person who loves
                learning new things.
              </p>
            </div>

            <div className="card">
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                This will be my little space of the internet or like everyone
                calls it (corner)
              </p>
            </div>
          </div>
          <div className="card about-down">
            <p>trying to add a newcharacteranimation</p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default About;
