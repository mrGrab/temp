import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  DeleteMenuItem,
  DisclosureMenuItem,
  QueueExecutionMenuItem,
  ResolveMenuItem,
  SelectMenuItem as Select,
  SilenceMenuItem,
  SubmenuMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ConfirmDelete from "/lib/component/partial/ConfirmDelete";
import ListHeader from "/lib/component/partial/ListHeader";
import { ToolbarSelectOption as Option } from "/lib/component/partial/ToolbarSelect";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import AutosuggestSelectMenu from "/lib/component/partial/AutosuggestSelectMenu";
import MenuController from "/lib/component/controller/MenuController";
import RootRef from "@material-ui/core/RootRef";

import { toggleParam } from "/lib/util/filterParams";

import StatusMenu from "./StatusMenu";

class EventsListHeader extends React.Component {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    filters: PropTypes.array.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickSelect: PropTypes.func.isRequired,
    onClickSilence: PropTypes.func.isRequired,
    onClickResolve: PropTypes.func.isRequired,
    onClickRerun: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    rowCount: PropTypes.number.isRequired,
    namespace: PropTypes.shape({
      checks: PropTypes.object,
      entities: PropTypes.object,
    }),
    onChangeFilters: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
  };

  static defaultProps = {
    namespace: null,
  };

  static fragments = {
    event: gql`
      fragment EventsListHeader_event on Event {
        isSilenced
      }
    `,
    namespace: gql`
      fragment EventsListHeader_namespace on Namespace {
        name
      }
    `,
  };

  updateSort = newValue => {
    this.props.onChangeQuery(params => ({ ...params, order: newValue }));
  };

  renderBulkActions = () => {
    const { selectedItems } = this.props;
    const selectedCount = selectedItems.length;
    const selectedSilenced = selectedItems.filter(ev => ev.isSilenced);
    const selectedNonKeepalives = selectedItems.filter(
      ev => ev.check.name !== "keepalive",
    );

    const allSelectedSilenced = selectedSilenced.length === selectedCount;
    const allSelectedUnsilenced = selectedSilenced.length === 0;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="resolve" visible="always">
          <ResolveMenuItem
            description="Resolve selected event(s)."
            onClick={this.props.onClickResolve}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item key="re-run" visible="if-room">
          <QueueExecutionMenuItem
            disabled={selectedNonKeepalives.length === 0}
            title="Re-run Checks"
            titleCondensed="Re-run"
            description="Queue adhoc check executions for selected event(s)."
            onClick={this.props.onClickRerun}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item
          key="silence"
          visible={allSelectedSilenced ? "never" : "if-room"}
        >
          <SilenceMenuItem
            disabled={allSelectedSilenced}
            onClick={this.props.onClickSilence}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item
          key="unsilence"
          visible={allSelectedUnsilenced ? "never" : "if-room"}
        >
          <UnsilenceMenuItem
            disabled={allSelectedUnsilenced}
            onClick={this.props.onClickClearSilences}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item key="delete" visible="if-room">
          {menu => (
            <ConfirmDelete
              identifier={`${selectedCount} ${
                selectedCount === 1 ? "event" : "events"
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

  renderActions = () => {
    const { namespace, filters, onChangeFilters } = this.props;

    return (
      <ToolbarMenu.Autosizer>
        {({ width }) => (
          <ToolbarMenu width={width}>
            <ToolbarMenu.Item key="hide" visible="if-room">
              <Select
                title="Silenced"
                onChange={toggleParam("silenced", onChangeFilters)}
              >
                <Option value="false" selected={filters.silenced === "false"}>
                  Hide Silenced
                </Option>
                <Option value="true" selected={filters.silenced === "true"}>
                  Hide Un-silenced
                </Option>
              </Select>
            </ToolbarMenu.Item>

            <ToolbarMenu.Item key="filter-by-entity" visible="if-room">
              <MenuController
                renderMenu={({ anchorEl, close }) => (
                  <AutosuggestSelectMenu
                    anchorEl={anchorEl}
                    onClose={close}
                    resourceType="entities"
                    objRef="core/v2/entity/metadata/name"
                    onChange={toggleParam("entity", onChangeFilters)}
                    namespace={namespace && namespace.name}
                  />
                )}
              >
                {({ open, ref }) => (
                  <RootRef rootRef={ref}>
                    <DisclosureMenuItem onClick={open} title="Entity" />
                  </RootRef>
                )}
              </MenuController>
            </ToolbarMenu.Item>

            <ToolbarMenu.Item key="filter-by-check" visible="if-room">
              <MenuController
                renderMenu={({ anchorEl, close }) => (
                  <AutosuggestSelectMenu
                    anchorEl={anchorEl}
                    onClose={close}
                    resourceType="checks"
                    objRef="core/v2/check_config/metadata/name"
                    onChange={toggleParam("check", onChangeFilters)}
                    namespace={namespace && namespace.name}
                  />
                )}
              >
                {({ open, ref }) => (
                  <RootRef rootRef={ref}>
                    <DisclosureMenuItem onClick={open} title="Check" />
                  </RootRef>
                )}
              </MenuController>
            </ToolbarMenu.Item>

            <ToolbarMenu.Item key="filter-by-status" visible="always">
              <SubmenuMenuItem
                autoClose
                title="Status"
                renderMenu={({ anchorEl, close }) => (
                  <StatusMenu
                    anchorEl={anchorEl}
                    onClose={close}
                    onChange={val => {
                      toggleParam("status", onChangeFilters)(val);
                      close();
                    }}
                    selected={filters.status}
                  />
                )}
              />
            </ToolbarMenu.Item>

            <ToolbarMenu.Item key="sort" visible="always">
              <Select
                title="Sort"
                onChange={this.updateSort}
                disableEmptySelection
              >
                <Option value="LASTOK">Last OK</Option>
                <Option value="SEVERITY">Severity</Option>
                <Option value="NEWEST">Newest</Option>
                <Option value="OLDEST">Oldest</Option>
              </Select>
            </ToolbarMenu.Item>
          </ToolbarMenu>
        )}
      </ToolbarMenu.Autosizer>
    );
  };

  render() {
    const { editable, selectedItems, rowCount, onClickSelect } = this.props;
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

export default EventsListHeader;
