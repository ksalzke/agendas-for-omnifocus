# About

This is an Omni Automation plug-in bundle for OmniFocus that allows for the management of 'event' and 'agenda' tasks.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from an amateur on the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/agendas-for-omnifocus/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plugin](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

1. Download the [latest release](https://github.com/ksalzke/dependency-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. Manually create the three types of tags below in OmniFocus. (These can be placed anywhere in your OmniFocus database.)
5. Configure your preferences using the `Preferences` action. (Note that to run this action on iOS, no tasks can be selected.)

The plugin makes use of three tags:

| Tag          | Example      | Description                                                                                                |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------- |
| Event Marker | `Make Event` | A temporary tag used to denote which actions should become 'events' when the `Add To Event` action is run. |
| Event        | `📆`          | Denotes a task that is an 'event' (meeting, call, etc) to which agenda items can be linked.                |
| Agenda Item  | `💬`          | Denotes a task that is an agenda item to be discussed at an event.                                         |

These tags can be set by using the 'Preferences' action, or the user will be prompted to choose them when one is first required.
