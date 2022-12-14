const ReportGenerator = require('lighthouse/report/generator/report-generator');
const fs = require('fs/promises');
const path = require('path');

const renderFromTemplate = (lighthouseTests, duration) => {
    const now = new Date();
    const day = `0${now.getDate()}`.slice(-2);
    const month = `0${now.getMonth() + 1}`.slice(-2);
    const year = now.getFullYear();
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);

    const durationMinutes = Math.round(duration) / 60000;
    const durationSeconds = Math.round((Math.round(duration) % 60000) / 1000);
    const testMinutes = durationMinutes < 1 ? '' : `${Math.floor(durationMinutes)}m`;
    const testSeconds = durationSeconds > 0 ? `${durationSeconds}s` : '';

    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <script>
            window.addEventListener('message', function (event) {
                const { lighthouseIndex, height } = JSON.parse(event.data)
                if (![null, undefined].includes(lighthouseIndex)) {
                    document.querySelectorAll('iframe')[lighthouseIndex].setAttribute('data-height', height);
                }
            }, false);
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhklEQVR4AWJxL/BhIAesev1U5tcflpncgNrKIsqNIwzC9feMpDUzs70kOczMzMzJJcxwCTMzncPMnOwtzBwzMzPb0vRfeZPp0VhPS5I39V5fdiXV1/VD+9QC7OVn9BsyH1XIoEI1PfmJvLFowVV564+34DFUHudbmfDh4kVXh//7XwE+WjS/YfXZe3yr4j2rqj1AIhSB7hZ8ZtPZu/zw8cK523U4wE1/rvPfWrz4zs0m9ZdC9yUJAlASdBAgocRegfF/f3/h/PuaFsxMdwjAR0vm1+06eMMfIrhLqTWqdH4EumU2SPfMhigJAlRQbZrgrRsl9U+Y2DYDFCz3ILC9kiAiqSrMwbWT0nceEnR+9Kggc2zjOJCASDENkg0a5HfZZgDP81CM3CrQs2Z1+o7DJ6ePr8sK0AOCHv5Jjdt3evyYSaZ351VIStIxPRAUtrBYbxC6w+BZ0ivVSBKkIhJhemSyZpfB00EiPO2VjzYkxhcqXQqCWCShGplvi3y0QxqbuBurMjyJeWnkHZuAEgIQGsUBqwrfjZ+IlBgKyRJzVVYF8O6qFWdh86YzQzMrZigYmxAyfvHgLZQ/LC1CbeniW2Hkqr/PH16SgvGuf2/uzNMBwJA/njxizGPtSyAf7EziJCMGRDRdhoAC4PL1A/SrKQMAAQkEfpJAcRQdrBJ7gNwjSpJsdwK+CANBkqa1LgQB4IicV9nYUct7gaxuDJUErQIiEAiMxLVOFlKzIktPpT0ggpdpC/8YAHnxbgkUY4tAAFSR7AAXNyAAWHJrA/kHGjzg5nleuwFO7Nd/IoDw4Pm58+4jNLmYG0wRA5bErc2Mr3Y+dXTDW1VvwqbJkzMCHQ4S1GTCBOIgUHJrGdEwqzR+jAp/o2qAZelUDoQnruEEdDclJI6576AlNVfc+22XN/+Y1vnJD0Yind6UpEEvn/Hqq15EYjCW7jZCJEpnNvDgkyelDjs106kuux2AAXCSobULOWP8mLhYlpoDMK4qAFXJGk+grtH8YXVz5KJblqaG1+VUdTc0I290bmUQAriGITRbdQnom0aoFj8kx1+wMD2ifncAXUQE4SkDqN1hE0jEophs1SUwZAOhUAiMCLwRtamtTZtbbmZErSAUHbSysaoEmnrsakiMiUAURi283gN6wans9oX8rOCrj7/JP35DFD+iQ7Au/K2KE1jzx6ujjUnXFH9KjEq6ZlhsTBICrNLJf47Pv/pkHzvup1w4dmUbEei0+bcXRqJuh5kVARQ8byyYxOwNGr7A87xh1tp8sGT+uMInrwi++Xj7TQz2d27NvwEkrOflAFQGIDA5khASBCGdO2/Z/MnLPwYfv5TFhjW7QhVKAB6afwe2LpFlFsCnlQEosgQgDsdOG1/LKeNqJS4JCSPJ/i+TakwEARor7gER1Iva5JmPOJK0RUqmoPnnlzFCtmIAhAAQEIQRgDaiYPIauNXcnDlRIrWNFY3hm7PG9YRqr7IV7HrCgAC17befjEvRq2nGhAHtBqDpOuI/I1diUUAMYIxEdyejBJqLnNoszGZtfiX/CztGv2mq+sdaAAAAAElFTkSuQmCC">
        <title>Lighthouse Report</title>
        <style>
            body {
                margin: 0;
                font-family: Arial, Helvetica;
                padding: 61px 10px 0;
            }
            
            .headline {
                font-family: Arial;
                overflow: hidden;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                box-shadow: 0 0 5px 0;
                background-color: #ffffff;
                z-index: 10;
                height: 51px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
    
            .text-logo {
                display: inline-block;
                position: relative;
                letter-spacing: -4px;
                margin: 0 10px;
                overflow: hidden;
                width: 82px;
                height: 36px;
                transform: translateY(-20%);
            }
    
            .text-logo__fed {
                transform: translateY(20%);
                display: inline-block;
            }
    
            .text-logo__x {
                transform: translate(3%, 9px);
                letter-spacing: 0px;
                display: inline-block;
                color: #FF6600;
            }
    
            .purple {
                color: #4D148C;
            }
    
            .orange {
                color: #FF6600;
            }

            iframe {
                border: none;
                width: 100%;
                height: 0;
                overflow: hidden;
                transition: all 0.3s ease-out 0s;
            }

            .toggle-view {
                cursor: pointer;
            }

            .toggle-view button {
                width: 30px;
                height: 30px;
                position: relative;
                display: inline-block;
                overflow: hidden;
                padding: 0;
                background: none;
                border: none;
                cursor: pointer;
            }

            .toggle-view button::after {
                content: "";
                width: 5px;
                height: 5px;
                border: solid 5px red;
                display: block;
                border-bottom-color: transparent;
                border-left-color: transparent;
                transition: transform 0.2s ease-out 0s;
                transform-origin: 60% 40%;
                transform: translate(25%, 25%) rotate(45deg);
                position: absolute;
                top: 0;
                left: 0;
                border-right-color: #4D148C;
                border-top-color: #FF6600;
            }

            .toggle-view button.active::after {
                transform: translate(25%, 25%) rotate(135deg);
            }

            .scroll-arrow.up {
                width: 110px;
                height: 24px;
                position: relative;
                display: inline-block;
                overflow: hidden;
                padding: 0 0 4px 0;
                background: none;
                border: none;
                cursor: pointer;
            }

            .scroll-arrow.up::after {
                content: "";
                width: 5px;
                height: 5px;
                border: solid 3px transparent;
                display: block;
                border-bottom-color: transparent;
                border-left-color: transparent;
                transition: transform 0.2s ease-out 0s;
                transform-origin: 60% 40%;
                transform: translate(25%, 25%) rotate(315deg);
                position: absolute;
                top: 8px;
                left: 0;
                border-right-color: #4D148C;
                border-top-color: #FF6600;
            }

            .scroll-arrow.up::before {
                content: "";
                width: 5px;
                height: 5px;
                border: solid 3px transparent;
                display: block;
                border-bottom-color: transparent;
                border-left-color: transparent;
                transition: transform 0.2s ease-out 0s;
                transform-origin: 60% 40%;
                transform: translate(25%, 25%) rotate(315deg);
                position: absolute;
                top: 0;
                left: 0;
                border-right-color: #4D148C;
                border-top-color: #FF6600;
            }

            #scrollIntoView {
                position: absolute;
                display: block;
                top: 0;
                left: 0;
                width: 0;
                height: 0;
                z-index: 0;
            }
        </style>
    </head>
    <body>
        <noscript>Lighthouse report requires JavaScript. Please enable.</noscript>
        <span id="scrollIntoView"></span>
        <div class="headline">
            <h1 class="text-logo">
                <span class="text-logo__fed"><span class="purple">Fed</span><span class="orange">E</span></span><span class="text-logo__x">x</span>
            </h1>
            <span>Lighthouse report generated on ${day}-${month}-${year}@${hours}:${minutes}. Tests took ${testMinutes}${testSeconds} to run</span>
            <span><button class="scroll-arrow up">Back to top</button></span>
        </div>
        ${lighthouseTests.reduce((output, test, index) => {
            return `${output}
            <div class="toggle-view"><label for="toggle-view-${index}">${test.requestedUrl}</label><button id="toggle-view-${index}" class="toggle-view__button" data-index="${index}"></button></div><iframe src="reports/report${index}.html"></iframe>
            `
        }, '')}
        <script>
            var iFrameActions = {
                add: function (iFrame) {
                    iFrame.style.cssText = 'height: 100vh;';
                },
                remove: function (iFrame) {
                    iFrame.style.cssText = 'height: 0px;';
                }
            };

            document.body.addEventListener('click', (event) => {
                const element = event.target;

                if (element.classList.contains('toggle-view__button')) {
                    const action = element.classList.contains('active') ? 'remove' : 'add';
                    const index = Number(element.getAttribute('data-index'));
                    element.classList[action]('active');
                    iFrameActions[action](document.querySelectorAll('iframe')[index])
                }

                if (element.classList.contains('scroll-arrow')) {
                    document.getElementById('scrollIntoView').scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest'
                    });
                }
            }, false);
        </script>
    </body>
</html>
    `;
};

const generatePage = (data, index) => {
    const postMessage = `<script>window.parent.postMessage(JSON.stringify({ lighthouseIndex: ${index}, height: document.body.getBoundingClientRect().height }), \'*\');</script>`;
    const allInOneLine = ReportGenerator.generateReport(data, 'html').replace(/((\<\!\-\-)(\S|\s){1,}(\-\-\>))|(\r|\t|\n){1,}/gm, '').replace('</body>', `${postMessage}</body>`);
    return fs.writeFile(path.join(__dirname, '..', 'docs', 'reports', `report${index}.html`), allInOneLine)
};

const generateReport = (data, duration) => {
    const updatedMarkup = renderFromTemplate(data, duration);
    fs.writeFile(path.join(__dirname, '..', 'docs', 'index.html'), updatedMarkup)
    .then(() => {
        console.log('HTML report generated!');
    });    
};

module.exports = {
    generateReport,
    generatePage
};
