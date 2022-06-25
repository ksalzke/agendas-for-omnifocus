# About

This is an Omni Automation plug-in bundle for OmniFocus that allows for the management of 'event' and 'agenda' tasks.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/agendas-for-omnifocus/issues) for known issues and planned changes/enhancements.

PLEASE NOTE: The `processEvents` function (which is used by the 'Manage Agenda Items', 'Complete And Update Event', and 'Update Agendas' actions) can only be run while the 'processEventRunning' synced preference is set to false. If, for some reason, this preference gets stuck set to 'true', preventing the dialogue from being shown, this can be reset using the `resetProcessingDialogue.omnifocus` script. A Keyboard Maestro macro is included which can be run every few hours, if desired.

# Installation & Set-Up

## Synced Preferences Plug-In

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plug-in](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

## Installation

1. Download the [latest release](https://github.com/ksalzke/agendas-for-omnifocus/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. Configure your preferences using the `Preferences` action.

## Set-Up

This plug-in makes use of three (or more) tags:

| Tag          | Example                  | Description                                                                                                         |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Agenda Item  | `💬`                      | Denotes a task that is an agenda item that has been linked to an event task.                                        |
| Linked Event | `🗓️`                      | Denotes an event task that has associated agenda items.                                                             |
| Event        | `Event` or `Appointment` | Denotes a task that represents an event which may have agenda items linked to it. Multiple 'event' tags can be set. |

These tags should be created manually and can then be set in Preferences.

# Actions

This plug-in contains the following actions:

## Add To Agenda

This action can be run when one or more tasks or projects are selected.

It prompts the user to select an event, and adds the item(s) to that event's agenda.

## Add to Agenda Via Project

This action can be run when one or more tasks or projects are selected.

It prompts the user to first select a project, then select an event contained within that project, and adds the item(s) to that event's agenda.

## Remove From Agenda

This action can be run when one or more tasks tagged with the 'agenda tag' (set in Preferences) are selected.

It prompts the user to select one or more events from the list of events that the selected agenda item(s) are assigned to, and then removes the item(s) from those agendas.

## Manage Agenda Item(s)

This action can be run when one task tagged with an event tag is selected.

It runs the `processEvents` function (described below), which allows the user to process the remaining agenda items in a number of ways.

## Go To Event

This action can be run when an agenda item is selected.

It allows the user to select from a list of events the agenda item is associated with, and then navigates to the selected event in the OmniFocus database.

## Go To Agenda Item

This action can be run when an event task is selected.

It allows the user to select from a list of agenda items associated with the event, and then navigates to the selected item in the OmniFocus database.

## Complete and Update Agenda Items

This action can be run when an event task is selected.

Firstly, it marks the selected task as completed.

It then runs the `processEvents` function (described below), which allows the user to process the remaining agenda items in a number of ways.

## Update All Agendas

This action can be run at anytime.

It runs the `updateAgendas` function, described in detail below.

## Set Last Updated

This action can be run if an event task is selected.

It marks the selecetd event task as the 'last updated', meaning that when 'Add to Agenda' action is run, this event will be the default selection.

## Preferences

This action allows the user to set the preferences for the plug-in. These sync between devices using the Synced Preferences plug-in linked above.

The following preferences are available:

* **Agenda Item Tag**. This tag is used to tag all agenda items.
* **Linked Event Tag**. This tag is used to denote an event that has associated agenda items.
* **Add link to related tasks to notes**. If this is selected, a link to the agenda item is added to the note of the event task, and vice versa. (Note that changing this setting will add or remove notes from all tasks.)
* **Event Tag(s)** Tasks tagged with any of these tags are considered 'events' and will be available to select when adding an agenda item. More than one tag may be selected.
* **Tag(s) To Show When Processing Items'** If selected, these tags are shown as prefixes to task names in the 'Manage Agenda Items' dialogue box, for user reference.

# Functions

This plug-in contains a number of functions within the `agendasLibrary` library.

## `loadSyncedPrefs () : SyncedPref`

Returns the [SyncedPref](https://github.com/ksalzke/synced-preferences-for-omnifocus) object for this plug-in.

If the user does not have the plug-in installed correctly, they are alerted.

## `getLinks () : Array<[string, string, Date]>`

Returns an array containing a list of agenda item/event pairs, as stored in the SyncedPref object for this plug-in.

Each pair is stored as a three-element array: the first element is the ID of the event task, the second element is the ID of the dependent task, and the third is the date the link was created.

## `goTo (task: Task)` (asynchronous)

If the current device is a Mac, a new tab is opened.

The task is then opened in the 'Projects' perspective.

## `addNotes (event: Task, item: Task)`

Adds notes to the event and item tasks in the formats:
* '[ Go to event task: omnifocus:///task/<id> ]', and 
* '[ Go to agenda item: omnifocus:///task/<id> ]'

## `removeNotes (eventID: string, itemID: string)`

Removes notes linking the two specified tasks.

## `removeAllNotes ()`

Removes all notes linking agenda item and event tasks across the database.

## `addAllNotes ()`

Adds all notes linking agenda item and event tasks across the database, in the format specified above.

## `isEvent (task: Task) : boolean`

Checks whether a task is an 'event' i.e. whether it has been tagged with a tag that is specified as an 'event tag' in preferences

## `isItem (task: Task) : boolean`

Checks whether a task is an agenda item i.e. whether it has the 'agenda item' tag.

## `searchForm (allItems: Array<T>, itemTitles: Array<String>, firstSelected: T, matchingFunction: function | null) : Form` (asynchronous)

Returns a form that has two fields.

The first field is an empty text box, which the user can type into to search the second field, which is a dropdown menu comprising `allItems` with titles `itemTitles`. The initial selected item will be `firstSelected`.

The `matchingFunction` should be an OmniFocus matching function such as `tagsMatching` or `projectsMatching`. If this parameter is passed, fuzzy search will be used (but note that the corresponding allItems parameter should be `flattenedProjects` or `flattenedTags`, for example; a subset cannot be used).

If the `matchingFunction` is null, the search will be exact.

## `selectAndAddToAgenda (items: Array<Task>, project: Project | null)` (asynchronous)

Prompts the user to select an event from the list of tasks that have been tagged with 'event'. If all tasks have been added to a particular event, it is still shown in the dialogue but is denoted with '[LINKED]'.

Once selected, all tasks are added as agenda items of the event using the `addToAgenda` function.

## `addToAgenda (event: Task, item: Task)` (asynchronous)

Creates a 'link' in synced preferences between the event and agenda item tasks, tags both tasks appropriately, and adds a link to each note (if that option is selected in preferences).

## `removeFromAgenda (eventID: string, itemID: string)` (asynchronous)

Removes 'link' in synced preferences between the event and agenda item tasks, removes tags if appropriate, and removes links (if any) from each note.

## `prefTag (prefTag: string) : Tag | null`

Returns the currently-set tag ('itemTag' or 'linkedEventTag'), if set in preferences. If no tag has been set, returns null.

## `getPrefTag (prefTag: string) : Tag` (asynchronous)

Returns the currently-set tag ('itemTag' or 'linkedEventTag'), if set in preferences. If no tag has been set, shows the preferences form.

## `eventTags () : Array<Tag>`

Returns an array of 'event tags' i.e. tags that denote that a task is an event that can be linked. These can be set in preferences. If there are no event tags set, returns an empty array.

## `tagLabelsToShow () : Array<Tag>`

Returns the array of 'tag labels' to be shown with the task names as part of the 'Manage Agenda Items' dialogue. This is set in Preferences.

## `getEventTags () : Tag` (asynchronous)

Returns an array of 'event tags' i.e. tags that denote that a task is an event that can be linked, if these have been set in preferences. If no event tags have been set, the preferences form is shown.

## `getItems (taskID: string) : Array<Task>`

Returns an array of tasks that have been 'linked' to the given event task.

## `getAllEvents () : Array<Task>` (asynchronous)

Returns an array containing all events i.e. all tasks that have been tagged with an 'event tag' (set in preferences).

## `getEvents (task: Task) : Array<Task>`

Returns an array containing all event tasks that contain the given task as an agenda item.

## `lastInstance (task: Task) : Task`

Returns the latest instance of a repeating task, or the current instance if there are no previous instances.

## `cleanUp ()` (asynchronous)

Tidies up the 'Agendas' links, by:
* Removing any duplicate links
* Removing any links where the agenda item has been completed, dropped, or no longer exists
* Removing the 'item' tag from any agenda item tasks which are no longer linked to any event tasks
* Removing the 'linked event' tag from any event tasks which are no longer linked to any agenda item tasks

## `updateAgendas()` (asynchronous)

Runs `cleanUp` function, then checks for any events that have been completed, dropped, or no longer exist. For each event, runs the `processEvent` function.

## `processEvent(eventID: string)` (asynchronous)

PLEASE NOTE: This function can only be run while the 'processEventRunning' synced preference is set to false. If, for some reason, this preference gets stuck set to 'true', preventing the dialogue from being shown, this can be reset using the `resetProcessingDialogue.omnifocus` script.

This function shows a form which displays a list of agenda items that are linked to the event task with the given ID. 

The user may select one or more of these events and then select one of the following processing options:

* Complete agenda item(s)
* Unlink agenda item(s) (i.e. remove from the agenda for this event)
* Link agenda item(s) to a different event
* Drop agenda item(s)
* Defer agenda item(s) (for repeating events only - defers to the next instance of an event)
* Rename agenda item (only one item may be selected)
* Show agenda item in project (only one item may be selected)
* Edit note(s)

Except if the 'show in project' option is selected, the prompt will continue to appear until all agenda items have been processed.
