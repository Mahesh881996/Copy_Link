import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  IListViewCommandSetListViewUpdatedParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import * as copy from 'copy-to-clipboard';
import swal from 'sweetalert';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICopyLinkCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CopyLinkCommandSet';

export default class CopyLinkCommandSet extends BaseListViewCommandSet<ICopyLinkCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CopyLinkCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;
    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        let itemName: string = event.selectedRows[0].getValueByName('FileLeafRef');
        let listName: string = `${this.context.pageContext.list.serverRelativeUrl}`.split("/").pop();
        let fullItemUrl: string = `${this.context.pageContext.web.absoluteUrl}/${listName}/${itemName}`;
        copy(fullItemUrl);
        swal("Link Copied!", "Press Ctrl+V to use it.", "success");
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const copyClassicLinkCommand: Command = this.tryGetCommand('COMMAND_1');
    if (copyClassicLinkCommand) {
      // This command should be hidden unless exactly one row is selected.
      copyClassicLinkCommand.visible = event.selectedRows.length === 1;
    }
  }
}
