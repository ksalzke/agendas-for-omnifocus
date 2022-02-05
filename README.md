# About

This is an Omni Automation plug-in bundle for OmniFocus that allows for the management of 'event' and 'agenda' tasks.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/agendas-for-omnifocus/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plugin](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

1. Download the [latest release](https://github.com/ksalzke/dependency-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. Configure your preferences using the `Preferences` action.

# Actions

This plug-in contains the following actions:

## Add To Agenda

This action can be run when one or more tasks or projects are selected.

It prompts the user to select an event, and adds the item(s) to that event's agenda.

## Remove From Agenda

This action can be run when one or more tasks tagged with the 'agenda tag' (set in Preferences) are selected.

It prompts the user to select one or more events from the list of events that the selected agenda item(s) are assigned to, and then remove the item(s) from those agendas.

## Manage Agenda Item(s)

This action can be run when one task tagged with an event tag is selected.

It shows a prompt which allows the user to select from the remaining agenda items, and select an action to take: complete, unlink (remove from agenda), re-link (add to a different agenda), or drop.

The prompt re-appears with any remaining items until either no items are left to process, or the user clicks 'Cancel'.

## Go To Event

This action can be run when an agenda item is selected.

It allows the user to select from a list of events the agenda item is associated with, and then navigates to the selected event in the OmniFocus database.

## Go To Agenda Item

This action can be run when an event task is selected.

It allows the user to select from a list of agenda items associated with the event, and then navigates to the selected item in the OmniFocus database.

## Complete and Update Agenda Items

This action can be run when an event task is selected.

Firstly, it marks the selected task as completed.

Then, it shows a prompt which allows the user to select from the remaining agenda items, and select an action to take: complete, unlink (remove from agenda), re-link (add to a different agenda), or drop.

The prompt re-appears with any remaining items until either no items are left to process, or the user clicks 'Cancel'.

## Update All Agendas

This action can be run at anytime.

It reviews the OmniFocus database for any completed, deleted, or dropped events, and then, for those events, it shows a prompt which allows the user to select from the remaining agenda items, and select an action to take: complete, unlink (remove from agenda), re-link (add to a different agenda), or drop.

The prompt re-appears with any remaining items until either no items are left to process, or the user clicks 'Cancel'.

## Preferences

This action allows the user to set the preferences for the plug-in. These sync between devices using the Synced Preferences plugin linked above.

The following preferences are available:

* **Agenda Item Tag**. This tag is used to tag all agenda items.
* **Add link to related tasks to notes**. If this is selected, a link to the agenda item is added to the note of the event task, and vice versa. (Note that changing this setting will add or remove notes from all tasks.)
* **Event Tag(s)** Tasks tagged with any of these tags are considered 'events' and will be available to select when adding an agenda item. More than one tag may be selected.

# Functions

This plugin contains a number of functions within the `agendasLibrary` library.

Details forthcoming.