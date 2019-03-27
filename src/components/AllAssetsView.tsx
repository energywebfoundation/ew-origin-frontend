import * as React from 'react'
import { SearchkitManager, SearchkitProvider, Layout, TopBar, SearchBox, LayoutBody, SideBar, HierarchicalMenuFilter, RefinementListFilter, LayoutResults, ActionBar, ActionBarRow, HitsStats, SelectedFilters, ResetFilters, Hits, NoHits } from 'searchkit'
const searchkit = new SearchkitManager("http://10.10.1.162:9200/asset")

const HitItem = (props) => (
    <div className='hititem'>
        <div>{props.result._source.serial_number}</div>
    </div>
)

class AssetHitsTable extends React.Component {
    render() {
        console.log(this.props)
        return (
            <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
            <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
                <thead>
                <tr>
                    <th>Serial Number</th>
                    <th>Metadata</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props['hits'].map((hit) =>
                    <tr key={hit._id}>
                        <td>{hit._source.serial_number}</td>
                        <td>{hit._source.metadata}</td>
                    </tr>
                    )
                }
                </tbody>
            </table>
            </div>
        )
    }
}

export interface AllAssetsViewProps {
    baseUrl: string
}

export interface AllAssetsViewState {
    detailViewForAssetId: number

}

export class AllAssetsView extends React.Component<AllAssetsViewProps, {}> {

    state: AllAssetsViewState

    constructor(props) {
        super(props)

        this.state = {
            detailViewForAssetId: null
        }

    }

    render() {
        var mysearchkit =
        <SearchkitProvider searchkit={searchkit}>
            <Layout>
            <TopBar>
                <SearchBox
                autofocus={true}
                searchOnChange={true}
                queryFields={['serial_number', 'metadata']} />
            </TopBar>
            <LayoutBody>
                <LayoutResults>
                <ActionBar>
        
                    <ActionBarRow>
                    <HitsStats />
                    </ActionBarRow>
        
                    <ActionBarRow>
                    <SelectedFilters />
                    <ResetFilters />
                    </ActionBarRow>
        
                </ActionBar>
                <Hits hitsPerPage={50} listComponent={AssetHitsTable}/>
                <NoHits />
                </LayoutResults>
            </LayoutBody>
            </Layout>
        </SearchkitProvider>
        return mysearchkit
    }
}