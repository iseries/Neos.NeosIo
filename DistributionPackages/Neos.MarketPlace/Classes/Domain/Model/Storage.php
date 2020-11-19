<?php
namespace Neos\MarketPlace\Domain\Model;

/*
 * This file is part of the Neos.MarketPlace package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\MarketPlace\Exception;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Domain\Service\ContentContextFactory;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeTemplate;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;

/**
 * Storage
 *
 * @api
 */
class Storage
{
    /**
     * @var ContentContextFactory
     * @Flow\Inject
     */
    protected $contextFactory;

    /**
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

    /**
     * @var array
     * @Flow\InjectConfiguration(path="repository")
     */
    protected $repository;

    /**
     * @var string
     */
    protected $workspaceName;

    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @param string $workspaceName
     */
    public function __construct($workspaceName = 'live')
    {
        $this->workspaceName = $workspaceName;
    }

    /**
     * @return NodeInterface
     * @throws Exception
     */
    public function node()
    {
        if ($this->node !== null) {
            return $this->node;
        }
        $context = $this->createContext($this->workspaceName);
        $this->node = $context->getNodeByIdentifier($this->repository['identifier']);
        if ($this->node === null) {
            throw new Exception('Repository node not found', 1457507995);
        }
        return $this->node;
    }

    /**
     * @param string $vendor
     * @return NodeInterface
     */
    public function createVendor($vendor)
    {
        $vendor = Slug::create($vendor);
        $node = $this->node()->getNode($vendor);
        if ($node !== null) {
            return $node;
        }
        $nodeTemplate = new NodeTemplate();
        $nodeTemplate->setNodeType($this->nodeTypeManager->getNodeType('Neos.MarketPlace:Vendor'));
        $nodeTemplate->setName($vendor);
        $nodeTemplate->setProperty('uriPathSegment', $vendor);
        $nodeTemplate->setProperty('title', $vendor);
        return $this->node()->createNodeFromTemplate($nodeTemplate);
    }

    /**
     * Creates a content context for given workspace and language identifiers
     *
     * @param string $workspaceName
     * @return ContentContext
     */
    protected function createContext($workspaceName)
    {
        $contextProperties = [
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => true,
            'inaccessibleContentShown' => true
        ];

        return $this->contextFactory->create($contextProperties);
    }
}
