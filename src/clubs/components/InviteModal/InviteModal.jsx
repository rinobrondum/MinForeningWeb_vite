import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Fragment } from 'react';
import {
  CopyToClipboardButton,
  Modal,
  Text,
  Box,
  Flex,
  Button,
  InputWithButton,
} from 'components';
import { getLinksArray, getUserLinks } from 'links/selectors';
import { deactivate } from 'links/actions';
import { create } from 'links/actions';
import LinksList from './LinksList';
import { withTranslation } from 'react-i18next';
import { getNestedGroupsArray } from 'groups';
import UserList from 'signup/components/UserList/UserList';
import { getActiveId } from 'clubs/selectors';

const InviteModal = ({ userLinks, create, links, deactivate, t, hide, groupId, active, groups, setGroupName, groupName }) => {

  useEffect(() => {
    if (groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].id == groupId) {
          setGroupName(groups[i].title);
          break;
        } else {
          setGroupName(t(groupName));
        }
      }
    }
  }, [groups]);

  useEffect(() => {
    create({ groupId: groupId, clubId: active });
  }, []);

  useEffect(() => {
    const groupLinks = [];
    if (userLinks.length > 0) {
      for (let i = 0; i < userLinks.length; i++) {
        if (userLinks[i].groupIds.includes(parseInt(groupId))) {
          groupLinks.push(userLinks[i]);
        }
      }
    }
    setGroupLinks(groupLinks);
  }, [userLinks]);

  const hideModal = (event) => {
    event.stopPropagation();
    hide();
  };

  const [isCopied, setIsCopied] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [groupLinks, setGroupLinks] = useState([]);
  const renderOverview = () => {
    var minOrganisation_websubDomain = window.location.host
    const useOrganisation = document.head.querySelector("[name~=useMinOrganisation][content]").content == "true";

    if (useOrganisation) {
      minOrganisation_websubDomain = localStorage.getItem('minOrganisation_websubDomain') + ".minorganisation.dk"
    }

    const link = userLinks.length > 0 ? userLinks[userLinks.length - 1] : undefined;
    const url = link
      ? `https://${minOrganisation_websubDomain}/invitation?clubToken=${link.token}`
      : undefined;

    return (
      <Fragment>
        <InputWithButton
          disabled
          value={url}
          buttonProps={{
            danger: true,
            onClick: link ? () => {
              deactivate(link.id);
              create({ groupId: groupId, clubId: active });
            } : undefined,
          }}
        >
          {t('Nulstil')}
        </InputWithButton>

        <Box mb={3} width={1}>
          <CopyToClipboardButton
            small
            block
            value={url}
            callback={() => setIsCopied(true)}
          >
            {isCopied ? t('Kopieret!') : t('Kopier')}
          </CopyToClipboardButton>
        </Box>

        <Button small success block onClick={() => setShowActive(true)}>
          {t('Oversigt over aktive links')}
        </Button>
      </Fragment>
    );
  };

  return (
    <Modal
      width={showActive ? 500 : 400}
      hide={hideModal}
      back={showActive ? () => setShowActive(false) : undefined}
      title={
        showActive ? t('Aktive links i foreningen') : t("Tilmeldingslink") + ` (${groupName})`
      }
    >
      <Flex flexDirection="column" p={3}>
        <Text secondary center mb={3}>
          {t(
            'Send linket til medlemmer eller indsæt link på hjemmeside og socialt medie'
          )}
        </Text>
        {showActive ? <LinksList links={groupId === "all" ? links : groupLinks} deactivate={deactivate} /> : renderOverview()}
      </Flex>
    </Modal>
  );
};

const enhancer = connect(
  createStructuredSelector({
    userLinks: getUserLinks,
    links: getLinksArray,
    groups: getNestedGroupsArray,
    active: getActiveId
  }),
  {
    create: create.requested,
    deactivate: deactivate.requested,
  }
);

export default withTranslation()(enhancer(InviteModal));
