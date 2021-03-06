import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  DeleteMenuItem,
  SelectMenuItem,
  SilenceMenuItem,
  UnsilenceMenuItem,
  DisclosureMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ConfirmDelete from "/lib/component/partial/ConfirmDelete";
import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import ToolbarSelectOption from "/lib/component/partial/ToolbarSelect/Option";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import AutosuggestSelectMenu from "/lib/component/partial/AutosuggestSelectMenu";
import MenuController from "/lib/component/controller/MenuController";
import RootRef from "@material-ui/core/RootRef";

import { toggleParam } from "/lib/util/filterParams";

class EntitiesListHeader extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    filters: PropTypes.array.isRequired,
    namespace: PropTypes.object,
    onChangeFilters: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func,
    onClickSelect: PropTypes.func,
    onClickSilence: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    selectedItems: PropTypes.array.isRequired,
  };

  static defaultProps = {
    onClickDelete: () => {},
    onClickSelect: () => {},
    namespace: undefined,
  };

  static fragments = {
    namespace: gql`
      fragment EntitiesListHeader_namespace on Namespace {
        name
      }
    `,
  };

  renderActions = () => {
    const {
      filters,
      namespace,
      onChangeFilters,
      onChangeQuery,
      order,
    } = this.props;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-class" visible="if-room">
          <SelectMenuItem
            title="Entity Class"
            onChange={toggleParam("class", onChangeFilters)}
          >
            {["agent", "proxy"].map(v => (
              <ToolbarSelectOption
                key={v}
                value={v}
                selected={filters.class === v}
              />
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="filter-by-subscriptions" visible="if-room">
          <MenuController
            renderMenu={({ anchorEl, close }) => (
              <AutosuggestSelectMenu
                anchorEl={anchorEl}
                onClose={close}
                resourceType="subscriptions"
                objRef="core/v2/entity/subscriptions"
                order="FREQUENCY"
                onChange={toggleParam("subscription", onChangeFilters)}
                namespace={namespace && namespace.name}
              />
            )}
          >
            {({ open, ref }) => (
              <RootRef rootRef={ref}>
                <DisclosureMenuItem onClick={open} title="Subscription" />
              </RootRef>
            )}
          </MenuController>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="sort" visible="if-room">
          <ListSortSelector
            options={[{ label: "Name", value: "ID" }]}
            onChangeQuery={onChangeQuery}
            value={order}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  renderBulkActions = () => {
    const { selectedItems } = this.props;

    const selectedCount = selectedItems.length;
    const selectedSilenced = selectedItems.filter(en => en.silences.length > 0);
    const allSelectedSilenced = selectedSilenced.length === selectedCount;
    const allSelectedUnsilenced = selectedSilenced.length === 0;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item
          key="silence"
          visible={allSelectedSilenced ? "never" : "always"}
        >
          <SilenceMenuItem
            description="Create a silence targeting selected entities."
            disabled={allSelectedSilenced}
            onClick={this.props.onClickSilence}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item
          key="unsilence"
          visible={allSelectedUnsilenced ? "never" : "if-room"}
        >
          <UnsilenceMenuItem
            description="Clear silences associated with selected entities."
            disabled={allSelectedUnsilenced}
            onClick={this.props.onClickClearSilences}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item key="delete" visible="if-room">
          {menu => (
            <ConfirmDelete
              identifier={`${selectedCount} ${
                selectedCount === 1 ? "entity" : "entities"
              }`}
              onSubmit={() => {
                this.props.onClickDelete();
                menu.close();
              }}
            >
              {confirm => (
                <DeleteMenuItem
                  autoClose={false}
                  title="Delete???"
                  onClick={confirm.open}
                />
              )}
            </ConfirmDelete>
          )}
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  render() {
    const { editable, onClickSelect, selectedItems, rowCount } = this.props;
    const selectedCount = selectedItems.length;

    return (
      <ListHeader
        sticky
        editable={editable}
        selectedCount={selectedCount}
        rowCount={rowCount}
        onClickSelect={onClickSelect}
        renderBulkActions={this.renderBulkActions}
        renderActions={this.renderActions}
      />
    );
  }
}

export default EntitiesListHeader;
