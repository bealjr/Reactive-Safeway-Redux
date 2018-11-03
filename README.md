# The Safeway

**About**

The Safeway is an app used to find safe walking directions through San Francisco's dangerous streets.

It's backed by a bidirectional A* algorithm and a graph data structure created by parsing DataSF's, "List of Streets and Intersections".  The graph's nodes represent San Francisco's intersections and each node's corresponding edges connect to other nodes forming a representation of San Francisco's street system.  Each street's edge-weight has been assigned a value determined by adding a standard block distance value to a crime value that is the result of parsing the crime data found on DataSF's, "Police Department Incident Reports: 2018 to Present" for any violent crime occurring in that location over the last six months and amalgamating the array of results.  Setting up our graph so that its edge-weight values are a representation of both the distance and crime of a given street allows us to use the bidirectional A* search algorithm to produce a resultant walking path that approaches the best combination of safety and distance between a given origin and destination.

https://data.sfgov.org/Geographic-Locations-and-Boundaries/List-of-Streets-and-Intersections/pu5n-qu5c
https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783
