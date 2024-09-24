import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import get from 'lodash/get';
import { withRouterParams } from 'lib/hoc';
import { Button, Modal, Box, Flex } from 'components';
import useCustomTranslation from 'lib/customT';
import { download, downloadByage } from 'members';
import { getActive as getActiveGroup } from 'groups/selectors';
import { getActiveClubName, getActive } from 'clubs/selectors';
import { Loading } from 'components';
import DownloadMemberByAgeModal from './DownloadMemberByAgeModal'; // Import the modal
import { Down } from 'components/icons'; // Import the Down icon
import { useFeature } from "@growthbook/growthbook-react";
import { module_export_household } from 'globalModuleNames';

const DownloadButton = ({
  download,
  downloadByage,
  group,
  activeClub,
  clubName,
  params: { key, direction },
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const t = useCustomTranslation();

  const handleDownload = () => {
    setIsFetching(true);

    new Promise((resolve, reject) =>
      download({ groupId: get(group, 'id'), key, direction, resolve, reject })
    ).then((data) => {
      const blob = new Blob(['\ufeff', data], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      link.download = group ? `${clubName}_${group.title}.csv` : `${clubName}.csv`;
      link.href = window.URL.createObjectURL(blob);
      link.click();
      setIsFetching(false);
    }).catch(() => {
      setIsFetching(false);
    });
  };

  const handleDownloadByAge = (values) => {
    const fromAge = Number(values.from);
    const toAge = Number(values.to);
    new Promise((resolve, reject) =>
      downloadByage({ fromAge, toAge, resolve, reject })
    ).then((data) => {
      const blob = new Blob(['\ufeff', data], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      link.download = `${clubName}_${fromAge}_${toAge}.csv`;
      link.href = window.URL.createObjectURL(blob);
      link.click();
      setIsFetching(false);
    }).catch(() => {
      setIsFetching(false);
    });
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button primary onClick={toggleDropdown}>
          <Flex>
            {isFetching ? <Loading size={20} /> : t('Eksporter Medlemsdata')}
            <Box ml={2}>
              <Down fill="white" />
            </Box>
          </Flex>
        </Button>
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#f9f9f9',
              zIndex: 1,
              minWidth: '160px',
              width: '100%'
            }}
          >
            <Button onClick={handleDownload} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              {t('Eksporter medlemmer')}
            </Button>
            <Button onClick={() => { setModalVisible(true); setDropdownOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              {t('Eksporter ud fra alder')}
            </Button>
            {useFeature(module_export_household).on && 
              <Button style={{ display: 'block', width: '100%', textAlign: 'left', paddingBottom: '0.5rem' }}>
                {t('Eksporter husstand')}
              </Button>
            }
          </div>
        )}
      </div>
      {modalVisible && (
        <DownloadMemberByAgeModal
          clubName={clubName}
          downloadByage={handleDownloadByAge}
          hide={() => setModalVisible(false)}
          setIsFetchingMembers={setIsFetching}
        />
      )}
    </>
  );
};

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      activeClub: getActive,
      clubName: getActiveClubName,
      group: getActiveGroup,
    }),
    { download, downloadByage }
  )
);

export default enhancer(DownloadButton);
