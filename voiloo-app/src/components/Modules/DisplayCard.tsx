import React, { useState } from 'react';
import {Avatar, Badge, Card, CardBody, H4, P, Small} from "@/components/Base";
import {StarMark} from "@/components/Modules/StarMark";

interface Props {
    title: string;
}

export const DisplayCard = ({ title }: Props) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <Card variant="elevated">
            <CardBody>
                <div className="flex items-center gap-4 mb-4">
                    <Avatar
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        size="lg"
                        status="online"
                    />
                    <div>
                        <H4>Thomas Martin</H4>
                        <Small>Développeur Web</Small>
                        <StarMark variant="display" value={4} size="sm" nb_avis={12} />
                    </div>
                </div>
                <P className="text-sm mb-4">Création de sites web et applications sur mesure.</P>
                <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>Node.js</Badge>
                </div>
            </CardBody>
        </Card>
    );
};