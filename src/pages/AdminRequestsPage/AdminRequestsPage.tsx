import React, {useEffect, useState} from "react"
import AdminNavigationPanel from "../../components/AdminNavigationPanel";
import {getProposes} from "../../firebase/firebase";
import {IPropose} from "../../types";
import Propose from "../../components/Propose";

const AdminRequestsPage: React.FC = () => {
    const [proposes, setProposes] = useState<IPropose[]>([]);

    const filterProposes = (id: string) => {
        setProposes(proposes.filter(e => e.id !== id))
    }

    useEffect(() => {
        getProposes().then(r => {
            let result: IPropose[] = [];
            r.docs.map((propose) => {
                const author = propose.data().author
                const location = propose.data().location
                result.push({
                    id: propose.id,
                    author: {
                        name: author.name,
                        uid: author.uid,
                        selectedLocations: author.selectedLocations,
                        role: author.role,
                        email: author.email,
                    },
                    images: propose.data().images,
                    date: propose.data().date,
                    location: {
                        name: location.name,
                        coordinates: location.coordinates,
                        images: location.images[0],
                        date: location.date,
                        rating: location.rating,
                        cachedRating: location.cachedRating,
                        id: location.id,
                        comments: location.comments,
                        description: location.description,
                    },
                })
            })
            setProposes(result)
        })
    }, [])

    console.log(proposes)


    return (
        <div className='page-container'>
            <AdminNavigationPanel/>
            <div className="content-container">
                <div className="gray-container propose-gray">
                    <div className="white-container favorite-title">Suggestions of the users</div>
                    {proposes.length === 0 ?
                        <div className="white-container empty-list">Suggestion list is empty...</div>
                        :
                        <div className="white-container proposes-list">
                            {proposes.map(propose => {
                                    return <Propose propose={propose} filterProposes={filterProposes}
                                                    key={propose.author.uid + propose.date}/>
                                }
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AdminRequestsPage
