# NUSModded

NUSModded is a project that aims to assist students of NUS, especially freshmen with module planning.

Entering university, a common issue faced by many freshmen is planning out their module selection, be it for that semester or the years ahead. New students may get confused as they are introduced to many new terms such as prerequisites or corequisites. Currently, the method most students use for their module planning is to search online for their respective course’s requirements and similar study plans, or seek advice from seniors. 

However, NUS has many different pathways, as one can take up additional minors/majors, so oftentimes, it is difficult to find someone with a similar degree path to compare their proposed study maps with. As such, having an optimally generated module roadmap that is customisable can be very helpful for their university planning.

We hope to make the module planning process significantly easier for most students, by being a central place for the module requirements of each course and enabling each student to plan their module roadmap over the entire course of study based on their requirements and preferences. The students would also be able to view issues, if any, in their roadmap such as not meeting the module application criteria.

This project was built using ReactJS, NestJS and Supabase. A more in depth writeup regarding this project can be found [here](https://docs.google.com/document/d/1foOU1kSgrwgTMGzBAYbM0iVod_GfRfPKN1_2mq-ZNCY/edit#).

# Features

Heres a short [video](https://www.youtube.com/watch?v=p-NsCqRm2fk) showcasing our project. 

Alternatively, here are some of the main features of NUSModded.

## Visuals
- Built with Material UI following Material Design principles.
- Light / dark mode!

## Account Profile & Settings
- Customize these to your preferences!
    - Username
    - Profile picture
    - Course of study 
    - Maximum MCs per semester

  ![image](website\src\resources/images/account.png)

## Account differentiation
- Users can only edit their roadmap and view courses.
- Administrators are able to edit courses on top of normal features.

## Modules and Courses
- View the courses offered by NUS and the list of modules available.

  ![image](website\src\resources/images/courses1.png)

  ![image](website\src\resources/images/courses2.png)

- Search and filter through modules by module code.
- Add the module directly to your roadmap from the module page.
  ![image](website\src\resources/images/modules.png)

## Roadmap
- Add and remove modules.
  ![image](website\src\resources/images/roadmap3.png)

- View module details directly from the roadmap page.
  ![image](website\src\resources/images/roadmap1.png)

- Edit semesters to be taken (visually as well :relaxed:)
  ![image](website\src\resources/images/roadmap2.png)

- Exempt modules, select modules from your selected course, check roadmap for any issues (module requirements / settings of MC limit) and more!
  ![image](website\src\resources/images/roadmap4.png)

A full run through of the features can be found [here](https://docs.google.com/document/d/1foOU1kSgrwgTMGzBAYbM0iVod_GfRfPKN1_2mq-ZNCY/edit#).

Have fun playing around with NUSModded! :smile:

# Installation

### `npm install`

Installs the app dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Website
You can alternatively view the work-in-progress project [here](https://orbital-nusmodded.vercel.app/).
