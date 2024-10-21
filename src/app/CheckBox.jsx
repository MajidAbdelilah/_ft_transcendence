import React from "react";
import styled from "styled-components";

const Checkbox = ({ selected, handleChange }) => {
  return (
    <StyledWrapper>
      <label className="custom-checkbox">
        <input
          name="difficulty"
          type="checkbox"
          checked={selected === 'Beginner'}
          onChange={() => handleChange('Beginner')}
        />
        <span className="checkmark" />
        <span className="label-text">Beginner</span>
      </label>
      <label className="custom-checkbox">
        <input
          name="difficulty"
          type="checkbox"
          checked={selected === 'Medium'}
          onChange={() => handleChange('Medium')}
        />
        <span className="checkmark" />
        <span className="label-text">Medium</span>
      </label>
      <label className="custom-checkbox">
        <input
          name="difficulty"
          type="checkbox"
          checked={selected === 'Hard'}
          onChange={() => handleChange('Hard')}
        />
        <span className="checkmark" />
        <span className="label-text">Hard</span>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 900px;

  .custom-checkbox {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
    color: #333;
    transition: color 0.3s;
  }

  .custom-checkbox input[type="checkbox"] {
    display: none;
  }

  .custom-checkbox .checkmark {
    width: 24px;
    height: 24px;
    border: 2px solid #333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    transition: background-color 0.3s, border-color 0.3s, transform 0.3s;
    transform-style: preserve-3d;
  }

  .custom-checkbox .checkmark::before {
    content: "\2713";
    font-size: 16px;
    color: transparent;
    transition: color 0.3s, transform 0.3s;
  }

  .custom-checkbox input[type="checkbox"]:checked + .checkmark {
    background-color: #242F5C;
    border-color: #242F5C;
    transform: scale(1.1) rotateZ(360deg) rotateY(360deg);
  }

  .custom-checkbox input[type="checkbox"]:checked + .checkmark::before {
    color: #fff;
  }

  .custom-checkbox:hover {
    color: #666;
  }

  .custom-checkbox:hover .checkmark {
    border-color: #666;
    background-color: #f0f0f0;
    transform: scale(1.05);
  }

  .custom-checkbox input[type="checkbox"]:focus + .checkmark {
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
    outline: none;
  }

  .custom-checkbox .checkmark,
  .custom-checkbox input[type="checkbox"]:checked + .checkmark {
    transition: background-color 1.3s, border-color 1.3s, color 1.3s, transform 0.3s;
  }

  .label-text {
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #242F5C;
    transition: color 0.3s;
  }

  @media (min-width: 1024px) {
    .label-text {
      font-size: 24px;
    }
  }
`;

export default Checkbox;
