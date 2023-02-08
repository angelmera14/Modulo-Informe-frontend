import isString from 'lodash/isString';
import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Link, Grid } from '@mui/material';
//
import Breadcrumbs from './Breadcrumbs';

// ----------------------------------------------------------------------

HeaderBreadcrumbs.propTypes = {
    links: PropTypes.array,
    action: PropTypes.node,
    heading: PropTypes.string.isRequired,
    moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    sx: PropTypes.object,
};

export default function HeaderBreadcrumbs({ links, action, heading, moreLink = '' || [], sx, ...other }) {
    return (
        <Box sx={{ mb: 1, ...sx }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid container >
                    <Grid item md={6} sm={6} xs={12}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" gutterBottom>
                                {heading}
                            </Typography>
                            <Breadcrumbs links={links} {...other} />
                        </Box>
                    </Grid>
                    <Grid container item md={6} sm={6} xs={12} justifyContent="flex-end" spacing={1}>
                        <Grid item md={3} sm={4} xs={12}>
                            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
                        </Grid>
                    </Grid>

                </Grid>
            </Box>

            <Box sx={{ mt: 2 }}>
                {isString(moreLink) ? (
                    <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
                        {moreLink}
                    </Link>
                ) : (
                    moreLink.map((href) => (
                        <Link
                            noWrap
                            key={href}
                            href={href}
                            variant="body2"
                            target="_blank"
                            rel="noopener"
                            sx={{ display: 'table' }}
                        >
                            {href}
                        </Link>
                    ))
                )}
            </Box>
        </Box>
    );
}
