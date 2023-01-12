import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Flex } from '@strapi/design-system/Flex';
import { Loader } from '@strapi/design-system/Loader';
import NpmPackageCard from '../NpmPackageCard';
import EmptyNpmPackageSearch from '../EmptyNpmPackageSearch';

const NpmPackagesGrid = ({
  status,
  npmPackages,
  installedPackageNames,
  useYarn,
  isInDevelopmentMode,
  npmPackageType,
  strapiAppVersion,
  debouncedSearch,
}) => {
  const { formatMessage } = useIntl();

  if (status === 'error') {
    return (
      <Flex paddingTop={8}>
        <AnErrorOccurred />
      </Flex>
    );
  }

  if (status === 'loading') {
    return (
      <Flex justifyContent="center" paddingTop={8}>
        <Loader>Loading content...</Loader>
      </Flex>
    );
  }

  const emptySearchMessage = formatMessage(
    {
      id: 'admin.pages.MarketPlacePage.search.empty',
      defaultMessage: 'No result for "{target}"',
    },
    { target: debouncedSearch }
  );

  if (npmPackages.length === 0) {
    return <EmptyNpmPackageSearch content={emptySearchMessage} />;
  }

  return (
    <Grid gap={4} data-testid="marketplace-results">
      {npmPackages.map((npmPackage) => (
        <GridItem col={4} s={6} xs={12} style={{ height: '100%' }} key={npmPackage.id}>
          <NpmPackageCard
            npmPackage={npmPackage}
            isInstalled={installedPackageNames.includes(npmPackage.attributes.npmPackageName)}
            useYarn={useYarn}
            isInDevelopmentMode={isInDevelopmentMode}
            npmPackageType={npmPackageType}
            strapiAppVersion={strapiAppVersion}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

NpmPackagesGrid.defaultProps = {
  npmPackages: [],
  installedPackageNames: [],
  strapiAppVersion: null,
  debouncedSearch: '',
};

NpmPackagesGrid.propTypes = {
  status: PropTypes.string.isRequired,
  npmPackages: PropTypes.array,
  installedPackageNames: PropTypes.arrayOf(PropTypes.string),
  useYarn: PropTypes.bool.isRequired,
  isInDevelopmentMode: PropTypes.bool.isRequired,
  npmPackageType: PropTypes.string.isRequired,
  strapiAppVersion: PropTypes.string,
  debouncedSearch: PropTypes.string,
};

export default NpmPackagesGrid;
