import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CompanyCardProps {
    company_name: string;
    start_time: string;
    end_time: string;
    position: string;
    description: string;
}

const Card = styled.div<{ level: number }>`
    background-color: ${({ level }) => getBackgroundColor(level)};
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    display: inline-block;
  `;

const CompanyCard: React.FC<CompanyCardProps> = ({ company_name, start_time, end_time, position, description }) => {
    return (
        <Card level={company_name} >
            <p>{company_name}</p>
        </Card>
    );
};


export default CompanyCard;
