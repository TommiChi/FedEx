const ReportGenerator = require('lighthouse/report/generator/report-generator');
const fs = require('fs/promises');
const path = require('path');

const generateHeadline = () => {
    const now = new Date();
    const day = `0${now.getDate()}`.slice(-2);
    const month = `0${now.getMonth() + 1}`.slice(-2);
    const year = now.getFullYear();
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);

    const text = `
    <style>
        .headline {
            font-family: Arial;
            overflow: hidden;
        }

        .text-logo {
            display: inline-block;
            position: relative;
            letter-spacing: -4px;
            margin: 0 10px;
            overflow: hidden;
            width: 82px;
            transform: translateY(4px);
        }

        .text-logo__fed {
            transform: translateY(20%);
            display: inline-block;
        }

        .text-logo__x {
            transform: translate(3%, 10px);
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
    </style>
    <div class="headline">
        <h1 class="text-logo"><span class="text-logo__fed"><span class="purple">Fed</span><span class="orange">E</span></span><span class="text-logo__x">x</span></h1>
        Lighthouse report generated on ${day}-${month}-${year}@${hours}:${minutes}
    </div>
    `;

    return text;
};

const injectHeadline = (markup) => {
    const headline = generateHeadline();
    const updatedMarkup = markup.replace('</noscript>', `</noscript>\n\n${generateHeadline()}`);
    return updatedMarkup;
};

const reportMultiplePages = (dataArray) => {
    const first = ReportGenerator.generateReport(dataArray[0], 'html');
    const rest = dataArray.slice(1);

    const htmlFragments = rest.reduce((output, data, index) => {
        const fragment = ReportGenerator.generateReport(data, 'html')
        .split('</noscript>')[1]
        .split('</body>')[0]
        // .replace(/(__initLighthouseReport__)/g, `__initLighthouseReport${index}__`)
        // .replace(/(lh\-log)/g, `lh-log-${index}`);

        return `${output}\n${fragment}`;
    }, '');

    console.warn(
        '***********************\n',
        htmlFragments
    );

    return first.replace('</body>', `${htmlFragments}\n</body>`);
};

const renderFromTemplate = (lighthouseTests) => {
    const now = new Date();
    const day = `0${now.getDate()}`.slice(-2);
    const month = `0${now.getMonth() + 1}`.slice(-2);
    const year = now.getFullYear();
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);

    return `
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhklEQVR4AWJxL/BhIAesev1U5tcflpncgNrKIsqNIwzC9feMpDUzs70kOczMzMzJJcxwCTMzncPMnOwtzBwzMzPb0vRfeZPp0VhPS5I39V5fdiXV1/VD+9QC7OVn9BsyH1XIoEI1PfmJvLFowVV564+34DFUHudbmfDh4kVXh//7XwE+WjS/YfXZe3yr4j2rqj1AIhSB7hZ8ZtPZu/zw8cK523U4wE1/rvPfWrz4zs0m9ZdC9yUJAlASdBAgocRegfF/f3/h/PuaFsxMdwjAR0vm1+06eMMfIrhLqTWqdH4EumU2SPfMhigJAlRQbZrgrRsl9U+Y2DYDFCz3ILC9kiAiqSrMwbWT0nceEnR+9Kggc2zjOJCASDENkg0a5HfZZgDP81CM3CrQs2Z1+o7DJ6ePr8sK0AOCHv5Jjdt3evyYSaZ351VIStIxPRAUtrBYbxC6w+BZ0ivVSBKkIhJhemSyZpfB00EiPO2VjzYkxhcqXQqCWCShGplvi3y0QxqbuBurMjyJeWnkHZuAEgIQGsUBqwrfjZ+IlBgKyRJzVVYF8O6qFWdh86YzQzMrZigYmxAyfvHgLZQ/LC1CbeniW2Hkqr/PH16SgvGuf2/uzNMBwJA/njxizGPtSyAf7EziJCMGRDRdhoAC4PL1A/SrKQMAAQkEfpJAcRQdrBJ7gNwjSpJsdwK+CANBkqa1LgQB4IicV9nYUct7gaxuDJUErQIiEAiMxLVOFlKzIktPpT0ggpdpC/8YAHnxbgkUY4tAAFSR7AAXNyAAWHJrA/kHGjzg5nleuwFO7Nd/IoDw4Pm58+4jNLmYG0wRA5bErc2Mr3Y+dXTDW1VvwqbJkzMCHQ4S1GTCBOIgUHJrGdEwqzR+jAp/o2qAZelUDoQnruEEdDclJI6576AlNVfc+22XN/+Y1vnJD0Yind6UpEEvn/Hqq15EYjCW7jZCJEpnNvDgkyelDjs106kuux2AAXCSobULOWP8mLhYlpoDMK4qAFXJGk+grtH8YXVz5KJblqaG1+VUdTc0I290bmUQAriGITRbdQnom0aoFj8kx1+wMD2ifncAXUQE4SkDqN1hE0jEophs1SUwZAOhUAiMCLwRtamtTZtbbmZErSAUHbSysaoEmnrsakiMiUAURi283gN6wans9oX8rOCrj7/JP35DFD+iQ7Au/K2KE1jzx6ujjUnXFH9KjEq6ZlhsTBICrNLJf47Pv/pkHzvup1w4dmUbEei0+bcXRqJuh5kVARQ8byyYxOwNGr7A87xh1tp8sGT+uMInrwi++Xj7TQz2d27NvwEkrOflAFQGIDA5khASBCGdO2/Z/MnLPwYfv5TFhjW7QhVKAB6afwe2LpFlFsCnlQEosgQgDsdOG1/LKeNqJS4JCSPJ/i+TakwEARor7gER1Iva5JmPOJK0RUqmoPnnlzFCtmIAhAAQEIQRgDaiYPIauNXcnDlRIrWNFY3hm7PG9YRqr7IV7HrCgAC17befjEvRq2nGhAHtBqDpOuI/I1diUUAMYIxEdyejBJqLnNoszGZtfiX/CztGv2mq+sdaAAAAAElFTkSuQmCC">
        <title>Lighthouse Report</title>
        <style>
            body {
                margin: 0;
            }
            
            .headline {
                font-family: Arial;
                overflow: hidden;
            }
    
            .text-logo {
                display: inline-block;
                position: relative;
                letter-spacing: -4px;
                margin: 0 10px;
                overflow: hidden;
                width: 82px;
                transform: translateY(4px);
            }
    
            .text-logo__fed {
                transform: translateY(20%);
                display: inline-block;
            }
    
            .text-logo__x {
                transform: translate(3%, 10px);
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
                width: 100vw;
            }
        </style>
    </head>
    <body>
        <noscript>Lighthouse report requires JavaScript. Please enable.</noscript>
        <div class="headline">
            <h1 class="text-logo">
                <span class="text-logo__fed"><span class="purple">Fed</span><span class="orange">E</span></span><span class="text-logo__x">x</span>
            </h1>
            Lighthouse report generated on ${day}-${month}-${year}@${hours}:${minutes}
        </div>
        ${lighthouseTests.reduce((output, test, index) => {
            const allInOneLine = ReportGenerator.generateReport(test, 'html').replace(/((\<\!\-\-)(\S|\s){1,}(\-\-\>))|(\r|\t|\n){1,}/gm, ''); // .replace(/(\/)/g, '\\/').replace(/(\')/g, "\\'");
            console.warn(allInOneLine);
            fs.writeFile(path.join(__dirname, '..', 'reports', `report${index}.html`), allInOneLine)
            return `${output}
            <div><label>${test.requestedUrl}</label><button></button></div><iframe src="reports/report${index}.html"></iframe>
            <script>
                var iframe = document.querySelectorAll('iframe')[${index}];
                iframe.style.cssText = 'height: ' + iframe.contentWindow.outerHeight + 'px;';
            </script>
            `
        }, '')}
    </body>
</html>
    `;
};

const generateReport = (data, isMultiple = false) => {
    // const markup = !!isMultiple ? reportMultiplePages(data) : ReportGenerator.generateReport(data, 'html');
    // const updatedMarkup = injectHeadline(markup);
    const updatedMarkup = renderFromTemplate(data);
    fs.writeFile(path.join(__dirname, '..', 'index.html'), updatedMarkup)
    .then(() => {
        console.log('HTML report generated!');
    });
};

module.exports = {
    generateReport,
};
