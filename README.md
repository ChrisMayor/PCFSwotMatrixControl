# PCF SWOT Analysis Control (drag and drop) for Power Platform

# Overview

The PCFSwotMatrixControl for Power Platform can be added as a web resource to the Account, Opportunity, or any custom entity form.

The control is a React component and uses Fluent UI.

The SWOT analysis helps salespeople and organizations identify:
Strengths (internal)
Weaknesses (internal)
Opportunities (external)
Threats (external)

related to business competition when pursuing an opportunity or acquiring a customer.

For general usage, see:

<img width="986" height="614" alt="image" src="https://github.com/user-attachments/assets/ace8f461-f55a-4597-ad39-96ac57465ea9" />

# Data binding

In model driven apps, PCFSwotMatrixControl is bound to a multi line text column

Output is saved to a json, sample:

````
{"strengths":[{"id":"mmw8r0w2-bqc6m","text":"Strong technical expertise in modern technologies (Cloud, APIs, microservices, etc.)"},{"id":"mmw8r4s0-3xo3a","text":"Experienced development and architecture team"}],"weaknesses":[{"id":"mmw8rkma-rjpdi","text":"Dependency on a few key specialists"},{"id":"mmw8rvjx-6oxvi","text":"Initial setup and ramp-up time for new project"}],"opportunities":[{"id":"mmw8r8ui-eogxs","text":"Growing demand for digital transformation projects"}],"threats":[{"id":"mmw8rcn0-pztt1","text":"Strong competition from large IT consultancies"},{"id":"mmw8rga9-wwzqa","text":"Security and compliance requirements increasing project complexity"}]}
````

# Samples

## Added to Opportunity Form

<img width="1697" height="786" alt="image" src="https://github.com/user-attachments/assets/9adafadb-2d2e-4bd5-aa96-eeca8c38f057" />

## Added to Canvas App

<img width="1484" height="833" alt="image" src="https://github.com/user-attachments/assets/7267d5a7-88e7-4307-ae4a-c22cd6a3dfc5" />
